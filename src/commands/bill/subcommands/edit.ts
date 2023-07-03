import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../../db/database";
import { TableBill, TableCaucus, TableDocket, TableParty, TableUser } from "../../../models/Models";
import { notifyError, notifyNoCharacter } from "../../../util/response";
import { BILL_STATUS_EMOJIS, EMOJI_SUCCESS } from "../../../util/statics";
import { choice, nth } from "../../../util/math";
import addToDocket from "../../../util/addToDocket";
import DiscordClient from "../../../client";

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

        let docket = (await getRow(DbTable.Dockets, UuidFields.Dockets, bill.Docket[0].value)) as TableDocket;

        let mappedDocketManagers = docket.Managers.map(d => d.value);

        if (!(mappedDocketManagers.includes(user.Uuid))){
            return await notifyError(interaction, `You must be a manager of the ${docket.Emoji} ${docket.Name} Docket to modify this bill.`);
        }


        let newStatus = interaction.options.get("status", false)?.value as string | null;
        let newDocket = interaction.options.get("docket", false)?.value as string | null;


        let history = bill.History;

        let data: any = {};
        let editStrs = [];

        if(newStatus){

            data["Status"] = newStatus;
            editStrs.push(`**Status:** ~~${BILL_STATUS_EMOJIS[bill.Status.value]} ${bill.Status.value}~~ → ${BILL_STATUS_EMOJIS[newStatus]} ${newStatus}`);

        }
        if (newDocket){

            let newDocketDb = (await getRow(DbTable.Dockets, UuidFields.Dockets, newDocket)) as TableDocket;

            data["Docket"] = [newDocket];
            data["History"] = `${history},${newDocketDb.Uuid}`;
            //data["Created"] = Date.now();
            editStrs.push(`**Docket:** ~~${docket.Emoji} ${docket.Name}~~ → ${newDocketDb.Emoji} ${newDocketDb.Name}`);

        }

        if (!newStatus && !newDocket){
            return await notifyError(interaction, `You did not specify to make any changes to ${bill.Uuid} ${bill.Name}.`)
        }

        await updateRow(DbTable.Bills, bill.id, data);


        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_SUCCESS} Edited Bill`)
            .setDescription(`${bill.Uuid} ${bill.Name} has been updated.\n` + editStrs.join('\n'))

        await interaction.reply({embeds: [embed]});

        

        if(newDocket){
            let newBill = (await getRow(DbTable.Bills, UuidFields.Bills, bill.Uuid)) as TableBill;
            let newDocketDb = (await getRow(DbTable.Dockets, UuidFields.Dockets, newDocket)) as TableDocket;

            await addToDocket(interaction.client as DiscordClient, newBill, newDocketDb);
        }

        





    }
}