import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../../db/database";
import { TableCaucus, TableUser } from "../../../models/Models";
import { choice, nth } from "../../../util/math";
import { notifyError, notifyNoCharacter } from "../../../util/response";
import { EMOJI_SUCCESS } from "../../../util/statics";
var _ = require("lodash")


export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let caucusId = interaction.options.get("caucus", true).value as string;
        let targetUser = interaction.options.getUser("user", true);
        
        let caucus = (await getRow(DbTable.Caucuses, UuidFields.Caucuses, caucusId)) as TableCaucus;

        if(!interaction.memberPermissions){
            return await notifyError(interaction, "How did you do this outside of a server?");
        }


        // CHECK #0: Does the user have permission to do this?
        if(!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild)){
            return await notifyError(interaction, "You do not have permission to do this.");
        }

        

        // GET EMOJI ID TO USE
        let emoji = caucus.Emoji

        let whips = caucus.Whips.map(w => w.value);
        whips.push(targetUser.id);

        // Update user row
        let response = await updateRow(DbTable.Caucuses, caucus.id, {
            "Whips": whips
        })

        if(!response){
            return await interaction.reply("An error occurred");
        }

        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_SUCCESS} Added whip to ${emoji} ${caucus.Name}`)
            .setDescription(`<@${targetUser.id}> is now a ${emoji} ${caucus.Name} whip.`)

        interaction.reply({embeds: [embed]});

    }


}