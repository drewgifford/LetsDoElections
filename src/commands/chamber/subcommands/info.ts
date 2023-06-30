import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { TableChamber } from "../../../models/Models";
import { choice } from "../../../util/math";

let tips = [
    "View a list of chambers using /chamber list",
    "Run for a race using /race join"
]



export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let chamberId = interaction.options.get("chamber", true).value as string;
        
        let chamber = (await getRow(DbTable.Chambers, UuidFields.Chambers, chamberId)) as TableChamber;


        let users: string[] = [];
        chamber.Users.forEach((u) => {
            users.push("<@"+u.value+">");
        })
        let usersString = users.join(", ");



        let embed = new EmbedBuilder()
            .setTitle(`${chamber.Emoji} ${chamber.Name} Information`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })
            .addFields(
            {
                name: `Members - ${chamber.Members}`,
                value: `${usersString || "*Nobody is in this chamber. You could be the first!*"}\n\n*${chamber.Description}*`
            }
            
            )



        interaction.reply({embeds: [embed]});


    }


}