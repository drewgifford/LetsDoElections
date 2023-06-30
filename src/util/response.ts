import { Interaction, EmbedBuilder, User, CommandInteraction } from "discord.js";
import { EMOJI_ERROR } from "./statics";

export async function notifyNoCharacter(interaction: any){
    return await notifyError(interaction, `You have not yet created a character. To create your character, use \`/editcharacter\`.`)
}

export async function notifyOtherNoCharacter(interaction: any, user: User){
    return await notifyError(interaction, `<@${user.id}> has not yet created a character.`);
}


export async function notifyError(interaction: any, message: string){

    let embed = new EmbedBuilder()
        .setTitle(`${EMOJI_ERROR} Error Running Command`)
        .setDescription(message);

    return await interaction.reply({embeds: [embed], ephemeral: true})


}