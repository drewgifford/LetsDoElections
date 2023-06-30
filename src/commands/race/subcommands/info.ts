import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { TableRace } from "../../../models/Models";
import { choice } from "../../../util/math";

let tips = [
    "View a list of races using /race list",
    "Join a race using /race list",
    "View a race's caucuses with /caucus list"
]



export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let raceId = interaction.options.get("race", true).value as string;
        
        let race = (await getRow(DbTable.Races, UuidFields.Races, raceId)) as TableRace;


        let users: string[] = [];
        race.Users.forEach((u) => {
            users.push("<@"+u.value+">");
        })
        let usersString = users.join(", ");



        let embed = new EmbedBuilder()
            .setTitle(`${race.Emoji} ${race.Name} Information`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })
            .addFields(
            {
                name: `Members - ${race.Members}`,
                value: `${usersString || "*Nobody is in this race. You could be the first!*"}\n\n*${race.Description}*`
            }
            
            )



        interaction.reply({embeds: [embed]});


    }


}