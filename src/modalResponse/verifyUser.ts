import { ActionRowBuilder } from "@discordjs/builders";
import { EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { TableUser } from "../models/Models";
import { DbTable, UuidFields, createRow, getRow, getSetting, setSetting, updateRow } from "../db/database";
import { EMOJI_SUCCESS } from "../util/statics";

export default async function(interaction: ModalSubmitInteraction, dbUser: TableUser | null){
    
    let referral: string = interaction.fields.getTextInputValue("referral");
    let age: string = interaction.fields.getTextInputValue("age");
    let discordAge: string = interaction.fields.getTextInputValue("discordAge");
    let mockGov: string = interaction.fields.getTextInputValue("mockGov")


    if(!interaction.guild) return;

    let verifyingUsers = JSON.parse(await getSetting("VerifyingUsers") as string);

    verifyingUsers[interaction.user.id] = {
        "referral": referral,
        "age": age,
        "discordAge": discordAge,
        "mockGov": mockGov
    }

    await setSetting("VerifyingUsers", JSON.stringify(verifyingUsers));



    let creatingCharacterRole = await getSetting("CreatingCharacterRole");
    let gatekeeperRole = await getSetting("GatekeeperRole");

    let member = await interaction.guild.members.fetch(interaction.user.id)

    if(gatekeeperRole) await member.roles.remove(gatekeeperRole);
    if(creatingCharacterRole) await member.roles.add(creatingCharacterRole);



    let createCharacterChannelId = await getSetting("CreateCharacterChannel") as string;

    let createCharacterChannel = await interaction.guild.channels.fetch(createCharacterChannelId);

    if(createCharacterChannel && createCharacterChannel.isTextBased()){

        await (await createCharacterChannel.send(`<@${interaction.user.id}>`)).delete();


    }




}