import { Interaction } from "discord.js"
import { IDiscordClient } from "../client"
import { EmbedBuilder } from "@discordjs/builders";
import { EMOJI_ERROR } from "../util/statics";

export default { 
    name: "interactionCreate",
    async execute(
        interaction: Interaction & {
            client: IDiscordClient
        }
    ) {

        if(!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error){
            console.warn(error);
            interaction.reply({ content: `An error occurred\n${error}`, ephemeral: true });
        }

    }


}