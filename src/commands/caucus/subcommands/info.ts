import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ColorResolvable } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { TableCaucus, TableChamber } from "../../../models/Models";
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

        if(!emoji){
            emoji = ""
        } else emoji = emoji + " "

        let caucusBalance = (caucus.Balance | 0).toLocaleString("en-US");
        let memberBalance = (caucus.UserBalance | 0).toLocaleString("en-US");

        let users: string[] = [];
        caucus.Users.forEach((u) => {
            users.push("<@"+u.value+">");
        })
        let usersString = users.join(", ");


        let seats = JSON.parse(caucus.Seats);

        let seatsStrings: string[] = [];
        let chambers = ((await listRows(DbTable.Chambers)) as TableChamber[]).forEach(chamber => {

            if(chamber.Uuid in seats){
                seatsStrings.push(`**${chamber.Emoji} ${chamber.Name}:** ${seats[chamber.Uuid]}`)
            }


        })

        


        let embed = new EmbedBuilder()
            .setTitle(`${emoji}${caucus.Name} Caucus Information`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })
            .addFields(
            {
                name: "Seats",
                value: seatsStrings.join('\n') || "*N/A*",
                inline: false
            },
            /*{
                name: "Caucus Balance",
                value: `**👥 Caucus:** \`$${caucusBalance}\`\n**👤 Members:** \`$${memberBalance}\``,
                inline: true
            },
            {
                name: "Race Spending",
                value: `**🏠 House:** \`$0\`\n**🏛️ Senate:** \`$0\`\n**🏢 President:** \`$0\``,
                inline: true
            },*/
            {
                name: `Whips - ${caucus.Whips.length}`,
                value: `${caucus.Whips.map(w => "<@"+w.value+">").join(', ') || "*None*"}`
            },
            {
                name: `Members - ${caucus.Members}`,
                value: `${usersString || "*Nobody is in this caucus. You could be the first!*"}`
            },
            {
                name: "Description",
                value: caucus.Description || "*No description*"
            }
            
            )
            .setColor(caucus.Color as ColorResolvable);



        interaction.reply({embeds: [embed]});


    }


}