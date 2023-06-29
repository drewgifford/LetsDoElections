import { Interaction } from "discord.js"
import DiscordClient, { IDiscordClient } from "../client"
import setupWebhook from "../webhook/userWebhook";

export default { 
    name: "ready",
    async execute(client: DiscordClient) {

        console.log("Bot online.");

        setupWebhook(client);

    }


}