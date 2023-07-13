import { ActionRowBuilder, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js"
import { IDiscordClient } from "../client"
import { DbTable, UuidFields, getRow, getSetting } from "../db/database";
import { TableRow, TableSetting } from "../models/Models";

export default { 
    name: "interactionCreate",
    async execute(
        interaction: Interaction & {
            client: IDiscordClient
        }
    ) {

        if(!interaction.isButton()) return;

        const message = interaction.message;

        
        let verifyMessageId = await getSetting("VerifyMessage");

        if (message.id != verifyMessageId){
            return;
        }

        // VERIFICATION MODAL

        let modal = new ModalBuilder()
            .setCustomId("verify")
            .setTitle("Verification");


        let referralInput = new TextInputBuilder()
            .setCustomId("referral")
            .setLabel("Where did you hear about Let's Do Elections?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        let ageInput = new TextInputBuilder()
            .setCustomId("age")
            .setLabel("How old are you?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        let discordAgeInput = new TextInputBuilder()
            .setCustomId("discordAge")
            .setLabel("How long have you had Discord?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        let mockGovInput = new TextInputBuilder()
            .setCustomId("mockGov")
            .setLabel("What, if any, mock govs have you been in?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        let firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(referralInput);
        let secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(ageInput);
        let thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(discordAgeInput);
        let fourthActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(mockGovInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

        return await interaction.showModal(modal);


    }


}