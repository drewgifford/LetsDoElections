import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../db/database";
import { TableCaucus, TableChamber, TableUser } from "../../models/Models";
import { notifyError, notifyNoCharacter, notifyOtherNoCharacter } from "../../util/response";
import { choice } from "../../util/math";
import { EMOJI_FINANCE, EMOJI_SUCCESS } from "../../util/statics";

const NEWS_AGENCIES: any = {
    "cnc": {
        "logo": "https://cdn.discordapp.com/attachments/1092538403960135831/1125240898075250728/cnc.png",
        "name": "Coda's News Channel"
    },
    "cspan": {
        "logo": "https://cdn.discordapp.com/attachments/1092538403960135831/1125241498603102258/279624782_359365902899119_6959877162055776172_n.jpg",
        "name": "C-SPAN"
    }
}

export default {

    data: new SlashCommandBuilder()
        .setName("news")
        .setDescription("Sends out a news ping")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addRoleOption(option =>
            option
            .setName("role")
            .setDescription("Role to ping")
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName("headline")
            .setDescription("Article headline")
            .setRequired(true))

        .addStringOption(option =>
            option
            .setName("description")
            .setDescription("The article")
            .setRequired(true))

        .addStringOption(option =>
            option
            .setName("agency")
            .setDescription("News Agency")
            .addChoices(
                { name: "Coda's News channel", value: "cnc" },
                { name: "C-SPAN", value: "cspan" }
            )
            .setRequired(true)
        )
        .addAttachmentOption(option =>
            option
            .setName("media")
            .setDescription("Media to add to news ping")
            .setRequired(false)
        ),


    async execute(interaction: ChatInputCommandInteraction) { 

        let role = interaction.options.getRole("role", true);
        let newsId = interaction.options.get("agency", true).value as string;

        let headline = interaction.options.get("headline", true).value as string;
        let description = interaction.options.get("description", true).value as string;
        let media = interaction.options.getAttachment("media");

        let imageUrl = NEWS_AGENCIES[newsId].logo;
        let name = NEWS_AGENCIES[newsId].name;

        if(!interaction.channel || !interaction.channel.isTextBased()) return;

        let msg = await interaction.reply({content: "Sending message...", ephemeral: true});

        let channel = interaction.channel as TextChannel;

        let webhook = (await channel.fetchWebhooks()).find(w => w.name == "LDE3-Aliases");

        if(!webhook){
            webhook = await channel.createWebhook({
                "name": "LDE3-Aliases",
            })
        }

        let newDesc = description.split("&n").join("\n");


        let embed = new EmbedBuilder()
            .setTitle(headline)
            .setDescription(newDesc)
            .setColor("#ff0000")
        
        if(media) embed.setImage(media.url);

        await msg.delete();
        await webhook.send({content: "<@&" + role.id + ">", embeds: [embed], username: name, avatarURL: imageUrl});


    }


}