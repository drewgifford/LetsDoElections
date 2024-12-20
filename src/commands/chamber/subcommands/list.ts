import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, listRows } from "../../../db/database";
import { TableChamber } from "../../../models/Models";
import { choice } from "../../../util/math";
import { EMOJI_CHAMBER } from "../../../util/statics";

let tips = [
    "View detailed information about a chamber with /chamber info",
    "Run for a race using /race join"
]


export default {

    async execute(interaction: ChatInputCommandInteraction) { 
        
        let chambers = (await listRows(DbTable.Chambers)) as TableChamber[];

        chambers = chambers.sort((a,b) => {
            if (a.Members < b.Members) return 1;
            return -1;
        })

        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_CHAMBER} List of Chambers`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })

        
        for (var chamber of chambers){


            embed.addFields({
                name: `${chamber.Emoji} ${chamber.Name} - ${chamber.Members} members`,
                value: `*${chamber.Description}*`
            })



        }


        interaction.reply({embeds: [embed]});


    }


}