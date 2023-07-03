import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { TableParty } from "../../../models/Models";
import { choice } from "../../../util/math";

let tips = [
    "View a list of parties using /party list",
    "Join a party using /party list",
    "View a party's caucuses with /caucus list"
]



export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let partyId = interaction.options.get("party", true).value as string;
        
        let party = (await getRow(DbTable.Parties, UuidFields.Parties, partyId)) as TableParty;

        

        // GET EMOJI ID TO USE
        let emoji = party.Emoji

        let partyBalance = (party.Balance | 0).toLocaleString("en-US");
        let caucusBalance = (party.CaucusBalance | 0).toLocaleString("en-US");
        let memberBalance = (party.UserBalance | 0).toLocaleString("en-US");

        let users: string[] = [];
        party.Users.forEach((u) => {
            users.push("<@"+u.value+">");
        })
        let usersString = users.join(", ");



        let embed = new EmbedBuilder()
            .setTitle(`${emoji} ${party.Name} Information`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })
            .addFields(
            /*{
                name: "Party Balance",
                value: `
                **🎉 Party:** \`$${partyBalance}\`
                **👥 Caucuses:** \`$${caucusBalance}\`
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
            },*/
            {
                name: `Whips - ${party.Whips.length}`,
                value: `${party.Whips.map(w => "<@"+w.value+">").join(', ') || "*None*"}`
            },
            {
                name: `Members - ${party.Members}`,
                value: `${usersString || "*Nobody is in this party. You could be the first!*"}`
            },
            {
                name: "Description",
                value: party.LongDesc || "*No description*"
            }
            
            )



        interaction.reply({embeds: [embed]});


    }


}