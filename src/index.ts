import { GatewayIntentBits, ActivitiesOptions, ActivityType, Partials } from 'discord.js';
import DiscordClient from "./client";
import { join } from "path"
import { readdirSync } from "fs";
import registerCommands from "./scripts/registerCommands"

require('dotenv').config();



const client = new DiscordClient({

    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
    
    ],
    partials: [
        Partials.Message,
        Partials.Reaction,
        Partials.GuildMember
    ]

});

const handlersPath = join(__dirname, "handlers");
const handlerFiles = readdirSync(handlersPath).filter((file) => file.endsWith("Handler.ts"));

handlerFiles.forEach((handlerFile: any) => {
    const filePath = join(handlersPath, handlerFile);
    import(filePath).then((handler) => handler.default(client));
});

registerCommands();

client.login(process.env.BOT_TOKEN);
