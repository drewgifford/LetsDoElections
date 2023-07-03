import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../db/database";
import { TableCaucus, TableChamber, TableUser } from "../../models/Models";
import { notifyError, notifyNoCharacter, notifyOtherNoCharacter } from "../../util/response";
import { choice } from "../../util/math";
import { EMOJI_FINANCE, EMOJI_SUCCESS } from "../../util/statics";

const NEWS_AGENCIES: any = {
    "cnc": {
        "logo": "https://cdn.discordapp.com/attachments/1092538403960135831/1125240898075250728/cnc.png",
        "name": "Coda's News Channel"
    },
    "cspan": {
        "logo": "https://cdn.discordapp.com/attachments/1092538403960135831/1125241498603102258/279624782_359365902899119_6959877162055776172_n.jpg",
        "name": "C-SPAN"
    }
}

export default {

    data: new SlashCommandBuilder()
        .setName("resetnicknames")
        .setDescription("Resets all nicknames")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


    async execute(interaction: ChatInputCommandInteraction) { 

        let guild = interaction.guild;

        if(!guild) return;

        let count = 0;

        guild.members.cache.forEach(g => {
            g.setNickname("").then(member => {
                console.log("[OK] Reset", g.displayName + "'s", "nickname.");
                count++;
            }).catch(e => {
                console.log("[WARN] Couldn't reset", g.displayName + "'s", "nickname.");
            });
        });

        await interaction.reply("Reset " + count + " users' nicknames");


    }


}