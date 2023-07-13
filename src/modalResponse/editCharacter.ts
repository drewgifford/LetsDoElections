import { ActionRowBuilder } from "@discordjs/builders";
import { EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { TableUser } from "../models/Models";
import { DbTable, UuidFields, createRow, getRow, getSetting, setSetting, updateRow } from "../db/database";
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
    if (dbUser.Faceclaim){
        embed.setThumbnail(dbUser.Faceclaim);
    } else {
        embed.setThumbnail(interaction.user.avatarURL())
    }




    if (interaction.customId == "editNewCharacter"){

        if(!interaction.guild) return;

        let verifyingUsers = JSON.parse(await getSetting("VerifyingUsers") as string);

        console.log(verifyingUsers);

        if (!(interaction.user.id in verifyingUsers)){
            console.log("User ID not in verifying users");
            return;
        }

        let generalChannelId = await getSetting("GeneralChannel");

        let generalChannel = generalChannelId ? await interaction.client.channels.fetch(generalChannelId) : null;

        let verifyChannelId = await getSetting("VerificationChannel") || "";
        let verifyChannel = await interaction.client.channels.fetch(verifyChannelId);

        if(verifyChannel && verifyChannel.isTextBased()){
                let userResponses = verifyingUsers[interaction.user.id];
                let vEmbed = new EmbedBuilder()

                    .setTitle("Pending Verification")
                    .setDescription(`<@${interaction.user.id}> is pending verification. Their answers to questions are below.`)
                    .addFields(

                        {
                            name: "Where did you hear about Let's Do Elections?",
                            value: userResponses.referral
                        },
                        {
                            name: "How old are you?",
                            value: userResponses.age
                        },
                        {
                            name: "How long have you had Discord?",
                            value: userResponses.discordAge
                        },
                        {
                            name: "What, if any, mock govs have you been in?",
                            value: userResponses.mockGov
                        }
                    )
                    .setThumbnail(interaction.user.avatarURL())
                    .setColor("Blurple")
                    .setFooter({text: "Use /verify accept or /verify fail to process this user."})

                await verifyChannel.send({embeds: [vEmbed], content: `<@${interaction.user.id}>`})
            }

        // REMOVE CREATING CHARACTER ROLE, GIVE UNVERIFIED ROLE
        let creatingCharacterRole = await getSetting("CreatingCharacterRole");
        let unverifiedRole = await getSetting("UnverifiedRole");


        let member = await interaction.guild.members.fetch(interaction.user.id)

        if(creatingCharacterRole) await member.roles.remove(creatingCharacterRole);
        if(unverifiedRole) await member.roles.add(unverifiedRole);

        if(generalChannel && generalChannel.isTextBased()){

            embed.setTitle("User Completed Pre-Verification!")
            embed.setDescription(`Welcome to Let's Do Elections, <@${interaction.user.id}>! You are currently in the pre-verification phase.\n\nDuring pre-verification, you will be able to send messages in non-canon channels, and view all channels a normal user can. Once you have been verified, you will receive a DM from the bot, and you will be able to join voice channels, join a party, run for office, and participate in the sim.`)
            embed.setColor("Blurple")

            await generalChannel.send({embeds: [embed], content: `<@${interaction.user.id}>`});
        }

        delete verifyingUsers[interaction.user.id];
        await setSetting("VerifyingUsers", verifyingUsers);

        return;
    }


    interaction.editReply({embeds: [embed]});
}