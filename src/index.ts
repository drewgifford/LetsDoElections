import { SapphireClient, ApplicationCommandRegistries, RegisterBehavior } from "@sapphire/framework";
import { GatewayIntentBits, ActivitiesOptions, ActivityType } from 'discord.js';

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

require('dotenv').config();

const client = new SapphireClient({

    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    loadMessageCommandListeners: true

});

client.on("ready", () => {

    client.user?.setActivity("discord.gg/lde", 
    {
        type: ActivityType.Playing,
        url: "https://discord.gg/lde"
    })

    console.log("I am alive!");

})

client.login(process.env.BOT_TOKEN);

