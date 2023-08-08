import { Interaction } from "discord.js"
import { IDiscordClient } from "../client"

export default { 
    name: "interactionCreate",
    async execute(
        interaction: Interaction & {
            client: IDiscordClient
        }
    ) {

        if(!interaction.isAutocomplete()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.autocomplete(interaction);

        } catch (error){

            console.warn(error);

        }

    }


}