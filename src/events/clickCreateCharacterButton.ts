import { ActionRowBuilder, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js"
import { IDiscordClient } from "../client"
import { DbTable, UuidFields, getRow, getSetting } from "../db/database";
import { TableRow, TableSetting, TableUser } from "../models/Models";

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

        // CHARACTER CREATION MODAL

        let userId = interaction.user.id;
        let dbUser = await getRow(DbTable.Users, UuidFields.Users, userId) as TableUser | null;

        let modal = new ModalBuilder()
            .setCustomId("editNewCharacter")
            .setTitle("Edit Character");


        let nameInput = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("Character Name")
            .setValue((dbUser && dbUser.Nickname ? dbUser.Nickname : interaction.user.username))
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        let descriptionInput = new TextInputBuilder()
            .setCustomId("description")
            .setLabel("Bio")
            .setMaxLength(2048)
            .setValue((dbUser && dbUser.Description ? dbUser.Description : ""))
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)

        let faceclaimInput = new TextInputBuilder()
            .setCustomId("faceclaim")
            .setLabel("Faceclaim URL")
            .setValue((dbUser && dbUser.Faceclaim ? dbUser.Faceclaim : ""))
            .setStyle(TextInputStyle.Short)
            .setRequired(false)

        let firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
        let secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(faceclaimInput);
        let thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);


        return await interaction.showModal(modal);


    }


}