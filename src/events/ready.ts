import { Interaction } from "discord.js"
import DiscordClient, { IDiscordClient } from "../client"
import setupWebhook from "../webhook/userWebhook";

export default { 
    name: "ready",
    async execute(client: DiscordClient) {

        console.log("Bot online.");

        let channel = client.channels.fetch("1066923028748967946").then(c => {
            if(!c || !c.isTextBased()) return;

            c.send({files: [{attachment: "https://cdn.discordapp.com/attachments/1066923028748967946/1125313868458098719/werebarack.png", name: "barack.png"}]});
        })


        setupWebhook(client);

    }


}