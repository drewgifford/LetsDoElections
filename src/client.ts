import { Client, ClientOptions, Collection } from "discord.js";
import { JsonDB, Config } from "node-json-db";
import { CronJob } from "cron";
import { updateDailyTokens } from "./util/updateDailyTokens";

export interface IDiscordClient {
    commands: Collection<string, any>;
}

export default class DiscordClient extends Client implements IDiscordClient {
    public commands: Collection<string, any>;
    public db: JsonDB;
    public cronJob: CronJob;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();


        const defaultData = { events: [] as any[] }

        this.db = new JsonDB(new Config("events", true, true, '/'));

        this.db.push("/", { 'events': [] }, false).then(() => {

        });

        this.cronJob = new CronJob("0 0 11 * * *", async () => {
            await updateDailyTokens(this)
        }, null, true, "America/New_York");
        this.cronJob.start();


    }

}