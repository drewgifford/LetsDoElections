import { EmbedBuilder, Interaction } from "discord.js"
import { IDiscordClient } from "../client"
import { DbTable, UuidFields, createRow, getRow, updateRow } from "../db/database";
import { TableUser } from "../models/Models";

const editCharacterModal = require("../modalResponse/editCharacter");
const submitBillModal = require("../modalResponse/submitBill");
const runCampaignModal = require("../modalResponse/runCampaign");
const verifyModal = require("../modalResponse/verifyUser");

export default { 
    name: "interactionCreate",
    async execute(
        interaction: Interaction & {
            client: IDiscordClient
        }
    ) {

        if(!interaction.isModalSubmit()) return;

        let modalId = interaction.customId;
        // Get modal type

        let dbUser = await getRow(DbTable.Users, UuidFields.Users, interaction.user.id) as TableUser | null;

        if (modalId.includes("runCampaign")){
            await interaction.deferReply();
            return await runCampaignModal.default(interaction, dbUser);
        }

        switch(modalId){

            
            case "verify":
                await interaction.deferUpdate();
                return await verifyModal.default(interaction, dbUser);
            case "editNewCharacter":
                await interaction.deferUpdate();
                return await editCharacterModal.default(interaction, dbUser);
            case "editCharacter":
                await interaction.deferReply();
                return await editCharacterModal.default(interaction, dbUser);
            case "submitBill":
                await interaction.deferReply();
                return await submitBillModal.default(interaction, dbUser);

        }

    }


}