import { ActionRowBuilder } from "@discordjs/builders";
import { ColorResolvable, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import { TableCaucus, TableChamber, TableDocket, TableParty, TableRace, TableUser } from "../models/Models";
import { DbTable, UuidFields, createRow, getRow, listRows, updateRow } from "../db/database";
import { notifyError, notifyNoCharacter } from "../util/response";
import { EMOJI_SUCCESS } from "../util/statics";
import DiscordClient from "../client";

export default async function(interaction: ModalSubmitInteraction, user: TableUser | null){
    
    let title: string = interaction.fields.getTextInputValue("title");
    let url: string | null = interaction.fields.getTextInputValue("url");
    let description: string = interaction.fields.getTextInputValue("description");

    if (!user){
        return await notifyNoCharacter(interaction);
    }

    if (user.Race.length == 0){
        return await interaction.editReply("You are not running in a race.");
    }

    let race = (await getRow(DbTable.Races, UuidFields.Races, user.Race[0].value)) as TableRace;

    if (!race.Active){
        return await interaction.editReply(`Campaigning is currently closed for the ${race.Emoji} ${race.Name} race.`);
    }


    let caucus = (await getRow(DbTable.Caucuses, UuidFields.Caucuses, user.Caucus[0].value)) as TableCaucus;

    let parts = interaction.customId.split("|");

    let eventType: string = parts[1];
    let states: string[] = parts[2].split(",");

    let campaignEmbed = new EmbedBuilder()
        .setTitle(`${caucus.Emoji} ${title}`)
        .setDescription(`**User:** <@${user.Uuid}>\n**States:** ${states.join(', ')}\n**Type:** ${eventType}\n\n${description}\n\n<t:${Math.round(Date.now()/1000)}>`)
        .setColor(caucus.Color as ColorResolvable)
    
    try {
        if(url){
            campaignEmbed.setImage(url);
        }
    } catch(e){
        return await interaction.editReply("You provided an invalid Media URL");
    }

    let channel = await interaction.client.channels.fetch(race.Channel);

    if(!channel || !(channel.isTextBased())){
        return await interaction.editReply("The campaign channel could not be found.");
    }

    channel.send({embeds: [campaignEmbed]}).then(async message => {


        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_SUCCESS} Campaign ${eventType} Ran`)
            .setDescription(`Ran ${eventType} in ${states.join(', ')}\n[Click to view campaign message](${message.url})`);


        let number = (await listRows(DbTable.Events)).length + 1;

        await createRow(DbTable.Events, {

            "Uuid": number,
            "Title": title,
            "Description": description,
            "User": [ interaction.user.id ],
            "EventType": eventType,
            "Race": [ race.Uuid ],
            "Url": url,
            "MessageUrl": message.url,
            "States": states
        });


        await interaction.editReply({content: `<@${interaction.user.id}>`, embeds: [embed]});


    })





}