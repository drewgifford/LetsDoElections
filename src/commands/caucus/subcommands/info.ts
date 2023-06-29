import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { TableCaucus } from "../../../models/Models";
import { choice } from "../../../util/math";

let tips = [
    "View a list of caucuses using /caucus list",
    "Join a caucus using /caucus join",
]



export default {

    async execute(interaction: CommandInteraction) {

        let caucusId = interaction.options.get("caucus", true).value as string;
        
        let caucus = (await getRow(DbTable.Caucuses, UuidFields.Caucuses, caucusId)) as TableCaucus;

        

        // GET EMOJI ID TO USE
        let emoji = caucus.Emoji
        let emojiId = /(?:.*?:){2}(.*).+/.exec(emoji);
        
        let emojiUrl = undefined;

        if(emojiId){
            emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId[1]}.png`
        }

        let caucusBalance = (caucus.Balance | 0).toLocaleString("en-US");
        let memberBalance = (caucus.UserBalance | 0).toLocaleString("en-US");

        let users: string[] = [];
        caucus.Users.forEach((u) => {
            users.push("<@"+u.value+">");
        })
        let usersString = users.join(", ");



        let embed = new EmbedBuilder()
            .setAuthor({
                name: `${caucus.Name} Caucus Information`,
                iconURL: emojiUrl
            })
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })
            .addFields(
            {
                name: "Caucus Balance",
                value: `
                **👥 Caucus:** \`$${caucusBalance}\`
                **👤 Members:** \`$${memberBalance}\`
                `,
                inline: true
            },
            {
                name: "Race Spending",
                value: `
                **🏠 House:** \`$0\`
                **🏛️ Senate:** \`$0\`
                **🏢 President:** \`$0\`
                `,
                inline: true
            },
            {
                name: `Members - ${caucus.Members}`,
                value: `${usersString}\n\n*${caucus.Description}*`
            }
            
            )



        interaction.reply({embeds: [embed]});


    }


}