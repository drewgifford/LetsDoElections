import { Client } from "discord.js";
import { getAllFiles } from "../util/files";
import { join } from "path"

export default async (client: Client) => {

    const eventPath = join(__dirname, "../events");
    const eventFiles = getAllFiles(eventPath).filter((file: any) => file.endsWith(".ts"));

    for (const file of eventFiles){

        const event = (await import(file)).default;

        if (event){

            if (event.once){
                client.once(event.name, (...args: any[]) =>
                    event.execute(...args))
            }
            else {

                client.on(event.name, (...args: any[]) => 
                    event.execute(...args, client)
                );

                console.log("Registered event", file);

            }


        }

    }

}