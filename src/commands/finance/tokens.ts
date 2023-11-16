import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../db/database";
import { TableUser } from "../../models/Models";
import { notifyError, notifyNoCharacter, notifyOtherNoCharacter } from "../../util/response";
import { choice } from "../../util/math";
import { EMOJI_FINANCE } from "../../util/statics";

let tips = [
    "Your tokens reset every cycle.",
    "You automatically earn new tokens every day at 9:00AM Eastern when running in a race.",
]

export default {
    
    data: new SlashCommandBuilder()
        .setName("tokens")
        .setDescription("Check the tokens of yourself or another user.")
        .addUserOption(option => option

            .setName("user")
            .setDescription("The user to check the tokens of. Defaults to yourself.")
            .setRequired(false)

        ),


    async execute(interaction: CommandInteraction) { 

        let user: User = interaction.options.getUser("user", false) || interaction.user;

        let userText = `<@${user.id}>'s`;

        if (user == interaction.user) userText = "your";


        let userId = user.id;

        let dbUser = await getRow(DbTable.Users, UuidFields.Users, userId) as TableUser | null;

        if (dbUser){

            let tokenBalance = (dbUser.Tokens | 0).toLocaleString("en-US");

            console.log(dbUser)

            // Respond with Embed
            let embed = new EmbedBuilder()
                .setTitle(`${EMOJI_FINANCE} User Wallet`)
                .setDescription(
                    `Viewing **${userText}** wallet:\n` + 
                    `:coin: **Tokens:** \`${tokenBalance}\`\n`
                )
                .setFooter({
                    text: "🛈 Tip: " + choice(tips)
                })
            interaction.reply({embeds: [embed]})

        }
        else {

            if (user.id == interaction.user.id){
                return await notifyNoCharacter(interaction);
            } else {
                return await notifyOtherNoCharacter(interaction, user);
            }

        }
        


    }


}