import { ActionRowBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, Emoji } from "discord.js";
import { EMOJI_CHARACTER, EMOJI_DOCKET, EMOJI_ERROR, EMOJI_SUCCESS } from "../../../util/statics";
import { DbTable, UuidFields, getRow, getSetting, listRows } from "../../../db/database";
import { TableBill, TableCaucus, TableChamber, TableParty } from "../../../models/Models";
import { notifyError } from "../../../util/response";

export default {

    execute: async function(interaction: ChatInputCommandInteraction){


        let user = interaction.options.getUser("user", true);


        if(!interaction.guild) return;

        await interaction.deferReply();

        let dmEmbed = new EmbedBuilder()
            .setTitle("You've Been Verified!")
            .setDescription("Congratulations! You have been verified on Let's Do Elections. You are now able to participate in the sim.")
            .addFields({

                name: "Where do I start?",
                value: "You should get started by joining a party, caucus, and state.\n- `/party join` - Joins a party\n- `/caucus join` - Joins a caucus\n- `/state join` - Joins a state"

            })
            .setColor("Green");

        let member = await interaction.guild.members.fetch(user.id);

        let unverifiedRole = await getSetting("UnverifiedRole") as string;
        let verifiedRole = await getSetting("VerifiedRole") as string;

        if(member.roles.cache.has(verifiedRole)){

            return await interaction.followUp("This user has already been verified.")
        }
        else if(!member.roles.cache.has(unverifiedRole)){

            return await interaction.followUp("User has not completed verification.")
        }
        

        await member.roles.remove(unverifiedRole);
        await member.roles.add(verifiedRole);



        await user.send({embeds: [dmEmbed]});
        await interaction.followUp(`<@${user.id}> has been verified!`)


    }


}