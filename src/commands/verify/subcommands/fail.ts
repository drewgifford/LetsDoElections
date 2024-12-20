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


        let member = await interaction.guild.members.fetch(user.id);

        let unverifiedRole = await getSetting("UnverifiedRole") as string;
        let verifiedRole = await getSetting("VerifiedRole") as string;

        if(!member.roles.cache.has(unverifiedRole)){

            return await interaction.followUp("User has not completed pre-verification.")
        }
        

        await member.roles.remove(unverifiedRole);
        await member.roles.add(verifiedRole);

        let dmEmbed = new EmbedBuilder()
            .setTitle("You have failed verification.")
            .setDescription("Unfortunately, for one reason or another, you have failed verification.")
            .addFields({

                name: "Why was I not verified?",
                value: "We don't disclose why we don't verify users - but it could be for one of several reasons, including a suspicious account, questionable history, age, or other factors."

            })
            .addFields({
                name: "Will I have a second chance?",
                value: "You may rejoin the server to attempt verification again. However, if you fail verification once more, you will be banned."
            })
            .setColor("Red");


        try {
            await user.send({embeds: [dmEmbed]});
        } catch(e){}

        try {
            if (member.bannable) await member.ban();
        } catch(e){}

        
        await interaction.followUp(`<@${user.id}> has failed verification.`)


    }


}