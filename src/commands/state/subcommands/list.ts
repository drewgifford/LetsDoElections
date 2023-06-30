import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, listRows } from "../../../db/database";
import { TableState } from "../../../models/Models";
import { choice } from "../../../util/math";
import { EMOJI_STATE } from "../../../util/statics";

let tips = [
    "Join a state using /state join",
    "Join a district using /district join"
]


export default {

    async execute(interaction: ChatInputCommandInteraction) { 
        
        let states = (await listRows(DbTable.States)) as TableState[];

        states = states.sort((a,b) => {
            if (a.Name > b.Name) return 1;
            return -1;
        })

        var embed = new EmbedBuilder()
            .setTitle(`${EMOJI_STATE} List of States`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            });

        let statesSubs = [], size = 50;

        for(let i = 0; i < states.length; i += size)
            statesSubs.push(states.slice(i, i + size));

        for (var statesSub of statesSubs){

            embed.addFields({
                name: "\u200b",
                value: statesSub.slice(0, 25).map(s => `\`${s.Uuid}\` **${s.Name}** - ${s.Users.length} members${s.Locked ? " :lock:" : ""}`).join("\n"),
                inline: true
            })
            embed.addFields({
                name: "\u200b",
                value: statesSub.slice(25, 50).map(s => `\`${s.Uuid}\` **${s.Name}** - ${s.Users.length} members${s.Locked ? " :lock:" : ""}`).join("\n"),
                inline: true
            })

            embed.addFields({
                name: "\u200b",
                value: "\u200b",
                inline: true
            })

        }


        interaction.reply({embeds: [embed]});


    }


}