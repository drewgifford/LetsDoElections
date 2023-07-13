import { ActionRowBuilder } from "@discordjs/builders";
import { EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { TableUser } from "../models/Models";
import { DbTable, UuidFields, createRow, getRow, getSetting, updateRow } from "../db/database";
import { EMOJI_SUCCESS } from "../util/statics";

export default async function(interaction: ModalSubmitInteraction, dbUser: TableUser | null){
    
    let name: string = interaction.fields.getTextInputValue("name");
    let faceclaim: string | null = interaction.fields.getTextInputValue("faceclaim");
    let description: string | null = interaction.fields.getTextInputValue("description");

    if (faceclaim == "") faceclaim = null;
    if (description == "") description = null;


    let data = {
        "Uuid": interaction.user.id,
        "Nickname": name,
        "Faceclaim": faceclaim,
        "Description": description
    }

    var response: boolean

    if(!dbUser){

        // CREATE USER
        response = await createRow(DbTable.Users, data);


    } else {
        response = await updateRow(DbTable.Users, dbUser.id, data);
    }

    if(!response){
        return await interaction.editReply("An error occurred");
    }

    dbUser = await getRow(DbTable.Users, UuidFields.Users, interaction.user.id) as TableUser

    let embed = new EmbedBuilder()
        .setTitle(`${EMOJI_SUCCESS} Updated Character`)
        .setDescription(
            `<@${interaction.user.id}>, your character has been updated!`
        )

        .addFields(
        {
            name: "Information",
            value: `📛 **Name:** ${dbUser.Nickname}`,
            inline: false
        },
        {
            name: "Description",
            value: `${dbUser.Description || "*No description set*"}`
        }
        
        
        )


        .setFooter({
            text: "🛈 Tip: If your faceclaim doesn't appear, you provided an invalid image URL."
        }
    )

    if (interaction.customId == "editNewCharacter"){

        if(!interaction.guild) return;

        let generalChannelId = await getSetting("GeneralChannel");

        let generalChannel = generalChannelId ? await interaction.client.channels.fetch(generalChannelId) : null;

        // REMOVE CREATING CHARACTER ROLE, GIVE UNVERIFIED ROLE
        let creatingCharacterRole = await getSetting("CreatingCharacterRole");
        let unverifiedRole = await getSetting("UnverifiedRole");

        
        let member = await interaction.guild.members.fetch(interaction.user.id)

        if(creatingCharacterRole) await member.roles.remove(creatingCharacterRole);
        if(unverifiedRole) await member.roles.add(unverifiedRole);

        if(generalChannel && generalChannel.isTextBased()){

            embed.setTitle("New user just joined!")
            embed.setDescription(`Please welcome <@${interaction.user.id}>! Their character is shown below:`)

            await generalChannel.send({embeds: [embed], content: `<@${interaction.user.id}>`});
        }
        return;
    }


    if (dbUser.Faceclaim){
        embed.setThumbnail(dbUser.Faceclaim);
    }


    interaction.editReply({embeds: [embed]});
}