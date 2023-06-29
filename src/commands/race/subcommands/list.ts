import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, listRows } from "../../../db/database";
import { TableRace } from "../../../models/Models";
import { choice } from "../../../util/math";

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
            .setAuthor({
                name: "List of Races",
                iconURL: "https://cdn-icons-png.flaticon.com/512/2673/2673205.png"
            })
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