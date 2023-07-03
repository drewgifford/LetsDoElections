import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../../db/database";
import { TableDocket, TableUser } from "../../../models/Models";
import { choice, nth } from "../../../util/math";
import { notifyError, notifyNoCharacter } from "../../../util/response";
import { EMOJI_SUCCESS } from "../../../util/statics";
var _ = require("lodash")



export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let docketId = interaction.options.get("docket", true).value as string;
        let targetUser = interaction.options.getUser("user", true);
        
        let docket = (await getRow(DbTable.Dockets, UuidFields.Dockets, docketId)) as TableDocket;

        if(!interaction.memberPermissions){
            return await notifyError(interaction, "How did you do this outside of a server?");
        }


        // CHECK #0: Does the user have permission to do this?
        if(!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild)){
            return await notifyError(interaction, "You do not have permission to do this.");
        }

        

        // GET EMOJI ID TO USE
        let emoji = docket.Emoji

        let managers = docket.Managers.map(w => w.value);

        if(managers.includes(targetUser.id)){
            managers.splice(managers.indexOf(targetUser.id, 1));
        }

        // Update user row
        let response = await updateRow(DbTable.Dockets, docket.id, {
            "Managers": managers
        })

        if(!response){
            return await interaction.reply("An error occurred");
        }

        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_SUCCESS} Removed manager from ${emoji} ${docket.Name}`)
            .setDescription(`<@${targetUser.id}> is no longer a ${emoji} ${docket.Name} manager.`)

        interaction.reply({embeds: [embed]});

    }


}