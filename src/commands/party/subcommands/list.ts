import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, listRows } from "../../../db/database";
import { TableParty } from "../../../models/Models";
import { choice } from "../../../util/math";

let tips = [
    "View detailed information about a party with /party info",
    "Join a party using /party join",
    "View a party's caucuses with /caucus list"
]


export default {

    async execute(interaction: ChatInputCommandInteraction) { 
        
        let parties = (await listRows(DbTable.Parties)) as TableParty[];

        parties = parties.sort((a,b) => {
            if (a.Members < b.Members) return 1;
            return -1;
        })

        let embed = new EmbedBuilder()
            .setAuthor({
                name: "List of Active Parties",
                iconURL: "https://cdn-icons-png.flaticon.com/512/2673/2673205.png"
            })
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })

        
        for (var party of parties){


            embed.addFields({
                name: `${party.Emoji} ${party.Name} - ${party.Members} members`,
                value: `*${party.ShortDesc}*`
            })



        }


        interaction.reply({embeds: [embed]});


    }


}