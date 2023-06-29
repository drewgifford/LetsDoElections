import { getAllFiles } from "../util/files";
import { join } from "path"

import { REST } from "discord.js";
import { Routes } from "discord.js";

require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;
const GUILD_ID = process.env.GUILD_ID as string;

export default function registerCommands(){

    const commands: any[] = [];

    const commandsPath = join(__dirname, "../commands");
    const commandFiles = getAllFiles(commandsPath, 2).filter((file) => file.endsWith(".ts"));

    (async() => {

        console.log(commandFiles)

        


        for (const file of commandFiles) {

            const command = (await import(file)).default;

            commands.push(command.data.toJSON());
        }

        const rest = new REST().setToken(BOT_TOKEN);

        /*rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] })
        .then(() => console.log('Successfully deleted all guild commands.'))
        .catch(console.error);*/

        rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands,
        })
        .then(() => console.log(`Successfully registered (${commands.length}) application commands.`))
        .catch(console.error);

    })();

}