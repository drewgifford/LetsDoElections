import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../../db/database";
import { TableBill, TableCaucus, TableDocket, TableParty, TableUser } from "../../../models/Models";
import { notifyError, notifyNoCharacter } from "../../../util/response";
import { BILL_STATUS_EMOJIS, EMOJI_SUCCESS } from "../../../util/statics";
import { choice, nth } from "../../../util/math";

let tips = [
    "View information about a bill with /bill info",
    "View all bills in a docket with /docket view",
]

export default {

    async execute(interaction: ChatInputCommandInteraction) {


        let billId = interaction.options.get("bill", true).value as string;

        let bill = (await getRow(DbTable.Bills, UuidFields.Bills, billId)) as TableBill | null;

        if (!bill){
            return await notifyError(interaction, `Bill ${billId} does not exist.`);
        }

        let user = (await getRow(DbTable.Users, UuidFields.Users, interaction.user.id)) as TableUser | null;

        if(!user){
            return await notifyNoCharacter(interaction);
        }

        if (user.Chamber.length == 0){
            return await notifyError(interaction, "You must be part of a chamber to cosponsor a bill.");
        }

        let cosponsors = bill.Cosponsors;
        let mappedCosponsors = bill.Cosponsors.map(c => c.Uuid);

        if (user.Uuid in mappedCosponsors){
            return await notifyError(interaction, "You have already cosponsored this bill.");
        }

        if (user.Uuid == bill.Author[0].value){
            return await notifyError(interaction, "You cannot cosponsor your own bill!");
        }

        mappedCosponsors.push(user.Uuid);


        await updateRow(DbTable.Bills, bill.id, {
            "Cosponsors": mappedCosponsors
        });


        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_SUCCESS} Cosponsored Bill`)
            .setDescription(`You are now a cosponsor of ${bill.Uuid} ${bill.Name}. You are the **${nth(cosponsors.length+1)}** cosponsor.`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })

        await interaction.reply({embeds: [embed]});





    }
}