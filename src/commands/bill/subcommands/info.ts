import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { TableBill, TableCaucus, TableDocket, TableParty } from "../../../models/Models";
import { notifyError } from "../../../util/response";
import { BILL_STATUS_EMOJIS, EMOJI_DOCKET } from "../../../util/statics";
import { choice } from "../../../util/math";

let tips = [
    "Cosponsor a bill with /bill cosponsor",
    "View all bills in a docket with /docket view",
]

export default {

    async execute(interaction: ChatInputCommandInteraction) {


        let billId = interaction.options.get("bill", true).value as string;

        let bill = (await getRow(DbTable.Bills, UuidFields.Bills, billId)) as TableBill | null;

        if (!bill){
            return await notifyError(interaction, `Bill ${billId} does not exist.`);
        }

        let cosponsors = bill.Cosponsors.map(d => `<@${d.value}>`);
        let author = `<@${bill.Author[0].value}>`;

        let party = (await getRow(DbTable.Parties, UuidFields.Parties, bill.Party[0].value)) as TableParty;
        let caucus = (await getRow(DbTable.Caucuses, UuidFields.Caucuses, bill.Caucus[0].value)) as TableCaucus;
        let docket = (await getRow(DbTable.Dockets, UuidFields.Dockets, bill.Docket[0].value)) as TableDocket;

        let emoji = (caucus.Emoji || (party.Emoji || ""));

        let editedDate = Date.parse(bill.Edited);
        let createdDate = Date.parse(bill.Created);

        let embed = new EmbedBuilder()
            .setTitle(`${emoji} ${billId} ${bill.Name}`)
            .setDescription(`[Click to view bill](${bill.Url})`)
            .addFields(
                {
                    name: "Bill Overview",
                    value: `**Author:** ${author}\n**Status:** ${BILL_STATUS_EMOJIS[bill.Status.value]} ${bill.Status.value}\n**Docket:** ${docket.Emoji || ""} ${docket.Name}\n**Created:** <t:${Math.round(createdDate/1000)}:f>\n**In docket since:** <t:${Math.round(editedDate/1000)}:R>`,
                },
                {
                    name: `Cosponsors - ${cosponsors.length}`,
                    value: `${cosponsors.join(', ') || "*No cosponsors yet*"}`
                },
                {
                    name: "Description",
                    value: `${bill.Description}`
                }
            )
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })
            .setThumbnail("https://www.seekpng.com/png/full/238-2388185_view-full-size-white-paper-scroll-png.png")




        await interaction.reply({embeds: [embed]});





    }
}