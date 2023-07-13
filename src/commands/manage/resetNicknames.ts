import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../db/database";
import { TableCaucus, TableChamber, TableParty, TableRace, TableUser } from "../../models/Models";
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

const ROLES: any[] = [];

export default {
    
    data: new SlashCommandBuilder()
        .setName("resetroles")
        .setDescription("Resets all roles")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


    async execute(interaction: ChatInputCommandInteraction) { 

        let guild = interaction.guild;

        return await notifyError(interaction, "This command is deprecated.");
        /*

        if(!guild) return;

        let parties = (await listRows(DbTable.Parties)) as TableParty[];
        let caucuses = (await listRows(DbTable.Caucuses)) as TableCaucus[];
        let races = (await listRows(DbTable.Races)) as TableRace[];
        let chambers = (await listRows(DbTable.Chambers)) as TableChamber[];

        for(var party of parties){
            if (party.Role){
                ROLES.push(party.Role);
            }
        }

        for(var caucus of caucuses){
            if (caucus.Role){
                ROLES.push(caucus.Role);
            }
        }

        for(var chamber of chambers){
            if (chamber.Role){
                ROLES.push(chamber.Role);
            }
        }

        for(var race of races){
            if (race.Role){
                ROLES.push(race.Role);
            }
        }
        let count = 0;

        await interaction.reply("Resetting all roles...");

        guild.members.fetch().then((members) => {


            members.forEach(g => {
                g.roles.remove(ROLES).then((a) => {
                    console.log("[OK] Reset", g.displayName + "'s", "roles.");
                    count++;
                }).catch(e => {
                    console.log("[WARN] Couldn't reset", g.displayName + "'s", "roles.");
                })
            });

        }).then(() => {
            interaction.followUp("Done! I reset " + count + " people.");
        })
        */
        


    }


}