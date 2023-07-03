import { EmbedBuilder, Interaction } from "discord.js"
import { IDiscordClient } from "../client"
import { DbTable, UuidFields, createRow, getRow, updateRow } from "../db/database";
import { TableUser } from "../models/Models";

const editCharacterModal = require("../modalResponse/editCharacter");
const submitBillModal = require("../modalResponse/submitBill");
const runCampaignModal = require("../modalResponse/runCampaign");

export default { 
    name: "interactionCreate",
    async execute(
        interaction: Interaction & {
            client: IDiscordClient
        }
    ) {

        if(!interaction.isModalSubmit()) return;

        if(!interaction.deferred){
            console.log("DEFERRED");
            await interaction.deferUpdate();
        }
        let modalId = interaction.customId;
        // Get modal type

        let dbUser = await getRow(DbTable.Users, UuidFields.Users, interaction.user.id) as TableUser | null;

        if (modalId.includes("runCampaign")){
            return await runCampaignModal.default(interaction, dbUser);
        }

        switch(modalId){

            

            case "editCharacter":
                return await editCharacterModal.default(interaction, dbUser);
            case "submitBill":
                return await submitBillModal.default(interaction, dbUser);

        }

    }


}