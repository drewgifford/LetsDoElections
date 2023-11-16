import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, PermissionFlagsBits } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../db/database";
import { TableRace, TableUser } from "../../models/Models";
import { notifyError, notifyNoCharacter, notifyOtherNoCharacter } from "../../util/response";
import { choice } from "../../util/math";
import { EMOJI_FINANCE } from "../../util/statics";
import { updateDailyTokens } from "../../util/updateDailyTokens";

let tips = [
    "Your tokens reset every cycle.",
    "You can check your tokens balance with /tokens",
]

export default {
    
    data: new SlashCommandBuilder()
        .setName("forcedistribute")
        .setDescription("Tests the token distribution system")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    ,


    async execute(interaction: CommandInteraction) { 

        await interaction.deferReply();
        await updateDailyTokens(interaction.client);
        await interaction.followUp("Force distributed tokens to all users.")


    }


}