import { Client, ClientOptions, Collection } from "discord.js";
import { JsonDB, Config } from "node-json-db";

export interface IDiscordClient {
    commands: Collection<string, any>;
}

export default class DiscordClient extends Client implements IDiscordClient {
    public commands: Collection<string, any>;
    public db: JsonDB;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();


        const defaultData = { events: [] as any[] }

        this.db = new JsonDB(new Config("events", true, true, '/'));

        this.db.push("/", { 'events': [] }, false).then(() => {

        });
    }

}