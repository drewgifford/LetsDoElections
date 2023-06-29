import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, TextInputStyle, ActionRowBuilder } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { TableCaucus, TableParty, TableUser } from "../../../models/Models";
import { notifyNoCharacter, notifyOtherNoCharacter } from "../../../util/response";
import { choice } from "../../../util/math";
import { ModalBuilder, TextInputBuilder } from "@discordjs/builders";

let tips = [
    "Your campaign balance resets every cycle.",
    "Pay another user with /pay.",
    "Transfer funds from your bank to your campaign using /fund"
]

export default {

    async execute(interaction: CommandInteraction) {

        let userId = interaction.user.id;
        let dbUser = await getRow(DbTable.Users, UuidFields.Users, userId) as TableUser | null;

        let modal = new ModalBuilder()
            .setCustomId("editCharacter")
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