import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../../db/database";
import { TableChamber, TableUser } from "../../../models/Models";
import { choice, nth } from "../../../util/math";
import { notifyError, notifyNoCharacter } from "../../../util/response";
import { EMOJI_SUCCESS } from "../../../util/statics";
var _ = require("lodash")


export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let chamberId = interaction.options.get("chamber", true).value as string;
        let targetUser = interaction.options.getUser("user", true);
        
        let chamber = (await getRow(DbTable.Chambers, UuidFields.Chambers, chamberId)) as TableChamber;

        if(!interaction.memberPermissions){
            return await notifyError(interaction, "How did you do this outside of a server?");
        }


        // CHECK #0: Does the user have permission to do this?
        if(!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild)){
            return await notifyError(interaction, "You do not have permission to do this.");
        }

        

        // GET EMOJI ID TO USE
        let emoji = chamber.Emoji

        let managers = chamber.Managers.map(w => w.value);
        managers.push(targetUser.id);

        // Update user row
        let response = await updateRow(DbTable.Chambers, chamber.id, {
            "Managers": managers
        })

        if(!response){
            return await interaction.reply("An error occurred");
        }

        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_SUCCESS} Added manager to ${emoji} ${chamber.Name}`)
            .setDescription(`<@${targetUser.id}> is now a ${emoji} ${chamber.Name} manager.`)

        interaction.reply({embeds: [embed]});

    }


}