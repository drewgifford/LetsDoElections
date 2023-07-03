import { Interaction } from "discord.js"
import { IDiscordClient } from "../client"

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
            console.log("Executing command...");
            await command.execute(interaction);
        } catch (error){
            console.log(error);
            interaction.reply({ content: `An error occurred\n${error}`, ephemeral: true });
        }

    }


}