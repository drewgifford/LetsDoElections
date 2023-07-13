import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, setSetting, updateRow } from "../../db/database";
import { TableCaucus, TableChamber, TableParty, TableRace, TableUser } from "../../models/Models";
import { notifyError, notifyNoCharacter, notifyOtherNoCharacter } from "../../util/response";
import { choice } from "../../util/math";
import { EMOJI_FINANCE, EMOJI_SUCCESS } from "../../util/statics";

const buttonVerify = new ButtonBuilder()
    .setCustomId("createCharacter")
    .setLabel(`Create a Character`)
    .setStyle(ButtonStyle.Success)
    .setEmoji("👤");

export default {
    
    data: new SlashCommandBuilder()
        .setName("charactermessage")
        .setDescription("Creates the character creation message")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


    async execute(interaction: ChatInputCommandInteraction) { 

        let channel = interaction.channel;
        await interaction.deferReply();


        let embed = new EmbedBuilder()
            .setTitle("Create a Character")
            .setDescription("Finish pre-verification and create your character below. Your character doesn't have to be human - do whatever you want to do!\n\nIf you don't plan to participate in the sim and just want to lurk - Just set your name and description to anything.")
            .setThumbnail("https://cdn.discordapp.com/attachments/1068018112420659220/1128834192982155345/LDE3_1990s_yea_3.png")

        
        let row = new ActionRowBuilder().setComponents(buttonVerify) as any;

        let message = await channel?.send({embeds: [embed], components: [row]});

        if (!message){

            await interaction.followUp({content: "An error occurred creating the message.", ephemeral: true});

        } else {
            await setSetting("CharacterMessage", message.id);
            await interaction.followUp({content: "Message created!", ephemeral: true});
        }

        
        


    }


}