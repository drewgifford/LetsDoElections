import { ActionRowBuilder } from "@discordjs/builders";
import { EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { TableUser } from "../models/Models";
import { DbTable, UuidFields, createRow, getRow, getSetting, updateRow } from "../db/database";
import { EMOJI_SUCCESS } from "../util/statics";

export default async function(interaction: ModalSubmitInteraction, dbUser: TableUser | null){
    
    let referral: string = interaction.fields.getTextInputValue("referral");
    let age: string = interaction.fields.getTextInputValue("age");
    let discordAge: string = interaction.fields.getTextInputValue("discordAge");
    let mockGov: string = interaction.fields.getTextInputValue("mockGov")

    let verifyChannelId = await getSetting("VerificationChannel") || "";
    let verifyChannel = await interaction.client.channels.fetch(verifyChannelId);

    if(!interaction.guild) return;

    if(verifyChannel && verifyChannel.isTextBased()){

        let vEmbed = new EmbedBuilder()

            .setTitle("Pending Verification")
            .setDescription(`<@${interaction.user.id}> is pending verification. Their answers to questions are below.`)
            .addFields(

                {
                    name: "Where did you hear about Let's Do Elections (LDE)?",
                    value: referral
                },
                {
                    name: "How old are you?",
                    value: age
                },
                {
                    name: "How long have you had Discord?",
                    value: discordAge
                },
                {
                    name: "Have you participated in any mock govs? If so, which ones?",
                    value: mockGov
                }
            )
            .setFooter({text: "Use /verify accept or /verify fail to process this user."})

        await verifyChannel.send({embeds: [vEmbed], content: `<@${interaction.user.id}>`})
    }


    let creatingCharacterRole = await getSetting("CreatingCharacterRole");
    let gatekeeperRole = await getSetting("GatekeeperRole");

    let member = await interaction.guild.members.fetch(interaction.user.id)

    if(gatekeeperRole) await member.roles.remove(gatekeeperRole);
    if(creatingCharacterRole) await member.roles.add(creatingCharacterRole);

    


}