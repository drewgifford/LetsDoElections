import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, TextInputStyle, ActionRowBuilder } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { TableCaucus, TableChamber, TableDocket, TableParty, TableUser } from "../../../models/Models";
import { notifyError, notifyNoCharacter, notifyOtherNoCharacter } from "../../../util/response";
import { choice } from "../../../util/math";
import { ModalBuilder, TextInputBuilder } from "@discordjs/builders";

let tips = [
    "View your own or another person's character with /character info",
    "Your faceclaim doesn't have to be human! Go crazy. if you wish!"
]

export default {

    async execute(interaction: CommandInteraction) {

        let userId = interaction.user.id;
        let dbUser = await getRow(DbTable.Users, UuidFields.Users, userId) as TableUser | null;

        if(!dbUser){
            return await notifyNoCharacter(interaction);
        }

        if(!dbUser.Chamber || dbUser.Chamber.length == 0){
            return await notifyError(interaction, "You are not apart of a chamber.");
        }

        let chamber = await getRow(DbTable.Chambers, UuidFields.Chambers, dbUser.Chamber[0].value) as TableChamber;
        let docket = await getRow(DbTable.Dockets, UuidFields.Dockets, chamber.Docket[0].value) as TableDocket;

        let modal = new ModalBuilder()
            .setCustomId("submitBill")
            .setTitle("Submit Bill to " + docket.Name + " Docket");


        let nameInput = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("Bill Name")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        let descriptionInput = new TextInputBuilder()
            .setCustomId("description")
            .setLabel("Short Description")
            .setMaxLength(250)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)

        let urlInput = new TextInputBuilder()
            .setCustomId("url")
            .setLabel("Google Docs URL")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        let firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
        let secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(urlInput);
        let thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        return await interaction.showModal(modal);

    }


}