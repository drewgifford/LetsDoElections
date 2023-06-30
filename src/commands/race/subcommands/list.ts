import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, listRows } from "../../../db/database";
import { TableRace } from "../../../models/Models";
import { choice } from "../../../util/math";
import { EMOJI_RACE } from "../../../util/statics";

let tips = [
    "View detailed information about a race with /race info",
    "Join a race using /race join",
    "View a race's caucuses with /caucus list"
]


export default {

    async execute(interaction: ChatInputCommandInteraction) { 
        
        let races = (await listRows(DbTable.Races)) as TableRace[];

        races = races.sort((a,b) => {
            if (a.Members < b.Members) return 1;
            return -1;
        })

        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_RACE} List of Races`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })

        
        for (var race of races){

            let locked = "";
            if(race.Locked) locked = " :lock:";

            embed.addFields({
                name: `${race.Emoji} ${race.Name} - ${race.Members} running${locked}`,
                value: `*${race.Description}*`
            })



        }


        interaction.reply({embeds: [embed]});


    }


}