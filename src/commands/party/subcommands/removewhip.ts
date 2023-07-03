import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../../db/database";
import { TableParty, TableUser } from "../../../models/Models";
import { choice, nth } from "../../../util/math";
import { notifyError, notifyNoCharacter } from "../../../util/response";
import { EMOJI_SUCCESS } from "../../../util/statics";
var _ = require("lodash")



export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let partyId = interaction.options.get("party", true).value as string;
        let targetUser = interaction.options.getUser("user", true);
        
        let party = (await getRow(DbTable.Parties, UuidFields.Parties, partyId)) as TableParty;

        if(!interaction.memberPermissions){
            return await notifyError(interaction, "How did you do this outside of a server?");
        }


        // CHECK #0: Does the user have permission to do this?
        if(!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild)){
            return await notifyError(interaction, "You do not have permission to do this.");
        }

        

        // GET EMOJI ID TO USE
        let emoji = party.Emoji

        let whips = party.Whips.map(w => w.value);

        if(whips.includes(targetUser.id)){
            whips.splice(whips.indexOf(targetUser.id, 1));
        }

        // Update user row
        let response = await updateRow(DbTable.Parties, party.id, {
            "Whips": whips
        })

        if(!response){
            return await interaction.reply("An error occurred");
        }

        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_SUCCESS} Removed whip from ${emoji} ${party.Name}`)
            .setDescription(`<@${targetUser.id}> is no longer a ${emoji} ${party.Name} whip.`)

        interaction.reply({embeds: [embed]});

    }


}