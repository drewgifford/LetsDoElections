import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, setSetting, updateRow } from "../../db/database";
import { TableCaucus, TableChamber, TableParty, TableRace, TableUser } from "../../models/Models";
import { notifyError, notifyNoCharacter, notifyOtherNoCharacter } from "../../util/response";
import { choice } from "../../util/math";
import { EMOJI_FINANCE, EMOJI_SUCCESS } from "../../util/statics";

const buttonVerify = new ButtonBuilder()
    .setCustomId("verify")
    .setLabel(`Verify Me`)
    .setStyle(ButtonStyle.Success)
    .setEmoji("✅");

export default {
    
    data: new SlashCommandBuilder()
        .setName("verifymessage")
        .setDescription("Creates the verification message")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


    async execute(interaction: ChatInputCommandInteraction) { 

        let channel = interaction.channel;
        await interaction.deferReply({ephemeral: true});


        let embed = new EmbedBuilder()
            .setTitle("Welcome to Let's Do Elections!")
            .setDescription("If you don't know us, we are a mock government of the United States built off a light alternate history starting in the 1980s. Let's Do Elections has been around in various forms since Early 2021, and this server is the third iteration of the LDE Series.\n\nTo get started, begin verification by clicking the button below!")
            .setThumbnail("https://cdn.discordapp.com/attachments/1068018112420659220/1128834192982155345/LDE3_1990s_yea_3.png")

        
        let row = new ActionRowBuilder().setComponents(buttonVerify) as any;

        let message = await channel?.send({embeds: [embed], components: [row]});

        if (!message){

            await interaction.followUp({content: "An error occurred creating the message.", ephemeral: true});

        } else {
            await setSetting("VerifyMessage", message.id);
            await interaction.followUp({content: "Message created!", ephemeral: true});
        }

        
        


    }


}