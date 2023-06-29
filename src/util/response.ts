import { Interaction, EmbedBuilder, User, CommandInteraction } from "discord.js";

export async function notifyNoCharacter(interaction: CommandInteraction){
    return await notifyError(interaction, `You have not yet created a character. To create your character, use \`/editcharacter\`.`)
}

export async function notifyOtherNoCharacter(interaction: CommandInteraction, user: User){
    return await notifyError(interaction, `<@${user.id}> has not yet created a character.`);
}


export async function notifyError(interaction: CommandInteraction, message: string){

    let embed = new EmbedBuilder()
        .setAuthor({
            name: "Error Running Command",
            iconURL: "https://em-content.zobj.net/source/skype/289/warning_26a0-fe0f.png"
        })
        .setDescription(message);

    return await interaction.reply({embeds: [embed], ephemeral: true})


}