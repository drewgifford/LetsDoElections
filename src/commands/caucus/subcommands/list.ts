import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { TableCaucus, TableParty } from "../../../models/Models";
import { choice } from "../../../util/math";

let tips = [
    "View detailed information about a caucus with /caucus info",
    "Join a caucus using /caucus join",
]


export default {

    async execute(interaction: CommandInteraction) { 
        
        let caucuses = (await listRows(DbTable.Caucuses)) as TableCaucus[];
        let partyId = interaction.options.get("party", true).value as string;

        let party = (await getRow(DbTable.Parties, UuidFields.Parties, partyId)) as TableParty;

        caucuses = caucuses.sort((a,b) => {
            if (a.Members < b.Members) return 1;
            return -1;
        }).filter((a) => (a.Party.length > 0 && a.Party[0].value == partyId));


        // GET EMOJI ID TO USE
        let emoji = party.Emoji
        let emojiId = /(?:.*?:){2}(.*).+/.exec(emoji);
        
        let emojiUrl = undefined;

        if(emojiId){
            emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId[1]}.png`
        }


        let embed = new EmbedBuilder()
        
            .setAuthor({
                name: `${party.Name} Caucuses`,
                iconURL: emojiUrl
            })
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })

        
        for (var caucus of caucuses){

            let locked = "";
            if(caucus.Locked) locked = " :lock:";

            embed.addFields({
                name: `${caucus.Emoji} ${caucus.Name} - ${caucus.Members} members${locked}`,
                value: `*${caucus.Description}*`
            })



        }


        interaction.reply({embeds: [embed]});


    }


}