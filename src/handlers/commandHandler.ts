import { readdirSync } from "fs"
import { IDiscordClient } from "../client"
import { join } from "path"

import { getAllFiles } from "../util/files"

export default async (client: IDiscordClient) => {

    const commandsPath = join(__dirname, "../commands");
    const commandFiles = getAllFiles(commandsPath, 2).filter((file: any) => file.endsWith(".ts"));

    console.log(commandFiles);

    for (const file of commandFiles){


        const command = (await import(file)).default;

        if ('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
            console.log("[SUCCESS]", file, "command loaded.");

        } else {

            console.log("[ERROR]", file, "command file failed to load.");
            continue;

        }

    }

}