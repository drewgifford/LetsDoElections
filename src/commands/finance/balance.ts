import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../db/database";
import { TableUser } from "../../models/Models";
import { notifyError, notifyNoCharacter, notifyOtherNoCharacter } from "../../util/response";
import { choice } from "../../util/math";
import { EMOJI_FINANCE } from "../../util/statics";

let tips = [
    "Your campaign balance resets every cycle.",
    "Pay another user with /pay.",
    "Transfer funds from your bank to your campaign using /fund"
]

export default {

    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Check the balance of yourself or another user.")
        .addUserOption(option => option

            .setName("user")
            .setDescription("The user to check the balance of. Defaults to yourself.")
            .setRequired(false)

        ),


    async execute(interaction: CommandInteraction) { 

        return await notifyError(interaction, "This command is deprecated.");

        /*let user: User = interaction.options.getUser("user", false) || interaction.user;

        let userText = `<@${user.id}>'s`;

        if (user == interaction.user) userText = "your";


        let userId = user.id;

        let dbUser = await getRow(DbTable.Users, UuidFields.Users, userId) as TableUser | null;

        if (dbUser){

            let bankBalance = (dbUser.BankBalance | 0).toLocaleString("en-US");
            let campaignBalance = (dbUser.CampaignBalance | 0).toLocaleString("en-US");

            console.log(dbUser)

            // Respond with Embed
            let embed = new EmbedBuilder()
                .setTitle(`${EMOJI_FINANCE} User Balance`)
                .setDescription(
                    `Viewing **${userText}** wallet:\n\n` + 
                    `💰 **Bank:** \`$${bankBalance}\`\n` + 
                    `💸 **Campaign:** \`$${campaignBalance}\`\n\u200b`
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
        */


    }


}