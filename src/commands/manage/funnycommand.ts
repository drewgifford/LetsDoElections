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

const ROLES: any[] = ["1128829973315198987"];

export default {
    
    data: new SlashCommandBuilder()
        .setName("funnycommand")
        .setDescription("Does a funny thing")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


    async execute(interaction: ChatInputCommandInteraction) { 

        let guild = interaction.guild;

        //return await notifyError(interaction, "This command is deprecated.");
        

        if(!guild) return;

        /*let parties = (await listRows(DbTable.Parties)) as TableParty[];
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
        }*/
        /*let count = 0;

        await interaction.reply("Grandfathering users into Verification");

        guild.members.fetch().then((members) => {


            members.forEach(g => {

                if(g.roles.cache.has("1089599209868636191")) return;

                g.roles.add(ROLES).then((a) => {
                    console.log("[OK] Verified", g.displayName);
                    count++;
                }).catch(e => {
                    console.log("[WARN] Couldn't verify", g.displayName);
                })
            })

            interaction.followUp("Done! I verified " + count + " people.");

        });*/
        
        


    }


}