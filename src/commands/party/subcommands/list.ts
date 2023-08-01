import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, listRows } from "../../../db/database";
import { TableParty } from "../../../models/Models";
import { choice } from "../../../util/math";
import { EMOJI_PARTY } from "../../../util/statics";

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
            .setTitle(`${EMOJI_PARTY} List of Parties`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })

        
        for (var party of parties){


            if(party.Hidden) continue;

            let locked = "";
            if(party.Locked) locked = " :lock:";

            embed.addFields({
                name: `${party.Emoji} ${party.Name} - ${party.Members} members${locked}`,
                value: `*${party.ShortDesc}*`
            })



        }


        interaction.reply({embeds: [embed]});


    }


}