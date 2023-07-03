import { ActionRowBuilder } from "@discordjs/builders";
import { EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { TableBill, TableCaucus, TableChamber, TableDocket, TableParty, TableUser } from "../models/Models";
import { DbTable, UuidFields, createRow, getRow, updateRow } from "../db/database";
import { notifyError, notifyNoCharacter } from "../util/response";
import { EMOJI_SUCCESS } from "../util/statics";
import DiscordClient from "../client";
import addToDocket from "../util/addToDocket";

export default async function(interaction: ModalSubmitInteraction, dbUser: TableUser | null){
    
    let name: string = interaction.fields.getTextInputValue("name");
    let url: string | null = interaction.fields.getTextInputValue("url");
    let description: string | null = interaction.fields.getTextInputValue("description");

    if(!dbUser) return;

    let chamber = await getRow(DbTable.Chambers, UuidFields.Chambers, dbUser.Chamber[0].value) as TableChamber;
    let party = await getRow(DbTable.Parties, UuidFields.Parties, dbUser.Party[0].value) as TableParty;
    let caucus = await getRow(DbTable.Caucuses, UuidFields.Caucuses, dbUser.Caucus[0].value) as TableCaucus;
    let docket = await getRow(DbTable.Dockets, UuidFields.Dockets, chamber.Docket[0].value) as TableDocket;

    let billId = `${docket.BillPrefix}-${docket.Bills.length + 1}`;

    let data = {
        "Uuid": billId,
        "Name": name,
        "Url": url,
        "Author": [ dbUser.id ],
        "Docket": [ docket.id ],
        "Party": [ party.id ],
        "Caucus": [ caucus.id ],
        "Description": description,
        "Status": "Not Introduced",
        "Cosponsors": [],
        "History": docket.Uuid
    }

    let emoji = (caucus.Emoji ? caucus.Emoji : party.Emoji);

    

    let embed = new EmbedBuilder()
        .setTitle(`${EMOJI_SUCCESS} Bill Submitted`)
        .setDescription(
            `${emoji} \`${billId}\` **${name}** has been placed in the ${docket.Name} docket.`
        )

        .setFooter({
            text: "🛈 Tip: To view all bills in a docket, use /docket view"
        }
    )

    try {
        embed.setURL(url)
    } catch (e){

        return await interaction.editReply("The Bill URL you provided is invalid.");

    }

    let response = await createRow(DbTable.Bills, data);

    if(!response){
        return await interaction.editReply("An error occurred");
    }

    await interaction.editReply({embeds: [embed]});

    let newBill = (await getRow(DbTable.Bills, UuidFields.Bills, billId)) as TableBill;

    await addToDocket(interaction.client as DiscordClient, newBill, docket);

}