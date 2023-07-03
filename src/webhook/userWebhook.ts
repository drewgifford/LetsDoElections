import express from "express"
import bodyParser from "body-parser"
import DiscordClient from "../client";
import { TableCaucus, TableChamber, TableParty, TableRace, TableUser } from "../models/Models";
import { DbTable, UuidFields, getRow, listRows } from "../db/database";
var _ = require("lodash");

export default async function setupWebhook(client: DiscordClient){

    const app = express();
    const PORT = 5000;

    await cacheRoles(client);

    app.use(bodyParser.json());

    app.post("/hook", (req, res) => {

        processUpdate(client, req.body as WebhookBody);
        res.status(200).end();

    });

    app.get("/hook", (req, res) => {

        res.send("Hello world!");
        res.status(200).end();
    })
    

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

}

export enum EventType {
    Create = "rows.created",
    Update = "rows.updated",
    Delete = "rows.deleted"
}

export type WebhookBody = {
    table_id: number,
    event_type: EventType,
    event_id: string,
    items: TableUser[],
    old_items: TableUser[],
}

let PARTY_ROLES: string[] = [];
let CAUCUS_ROLES: string[] = [];
let RACE_ROLES: string[] = [];
let CHAMBER_ROLES: string[] = [];

export async function cacheRoles(client: DiscordClient){

    PARTY_ROLES = [];
    CAUCUS_ROLES = [];

    let parties = (await listRows(DbTable.Parties)) as TableParty[];
    let caucuses = (await listRows(DbTable.Caucuses)) as TableCaucus[];
    let races = (await listRows(DbTable.Races)) as TableRace[];
    let chambers = (await listRows(DbTable.Chambers)) as TableChamber[];

    for(var party of parties){
        if (party.Role){
            PARTY_ROLES.push(party.Role);
        }
    }

    for(var caucus of caucuses){
        if (caucus.Role){
            CAUCUS_ROLES.push(caucus.Role);
        }
    }

    for(var chamber of chambers){
        if (chamber.Role){
            CHAMBER_ROLES.push(chamber.Role);
        }
    }

    for(var race of races){
        if (race.Role){
            RACE_ROLES.push(race.Role);
        }
    }



}


export async function processUpdate(client: DiscordClient, body: WebhookBody){

    // This will always be a user that's updated, so we can just do stuff

    if(!body) return;
    if(!("items" in body) || body.items.length == 0) return;


    let newEntry = body.items[0];
    let oldEntry = body.old_items && body.old_items.length > 0 ? body.old_items[0] : null;

    function checkEntry(value: string){

        if (!oldEntry) return true;


        let newValue = (newEntry as any)[value];
        let oldValue = (oldEntry as any)[value];

        if (!_.isEqual(newValue, oldValue)){
            return true;
        }
        return false;


        //return (!oldEntry || (oldEntry && (newEntry as any)[value] != (oldEntry as any)[value]));
    
    }

    console.log(body);
    

    // What we have to update: Nickname, Caucus, Party, State, District.

    let userId = newEntry.Uuid;
    let GUILD_ID = process.env.GUILD_ID as string;
    let guild = await client.guilds.fetch(GUILD_ID);
    let user = await guild.members.fetch(userId);

    //TODO: Limit to checkEntry() of only the values i'm checking. too many api calls otherwise

    let nicknameChanged = checkEntry("Nickname");
    let partyChanged = checkEntry("Party");
    let caucusChanged = checkEntry("Caucus");
    let districtChanged = checkEntry("District");
    let stateChanged = checkEntry("State");
    let raceChanged = checkEntry("Race");
    let chamberChanged = checkEntry("Chamber");

    // Check if any of these are different

    if (caucusChanged){
        // Update caucus role

        let caucusId = newEntry.Caucus.length > 0 ? newEntry.Caucus[0].value : null;

        let caucus = null;

        if(caucusId){
            caucus = (await getRow(DbTable.Caucuses, UuidFields.Caucuses, newEntry.Caucus[0].value)) as TableCaucus | null;
        }

        // Remove all their caucus roles before giving them a new one

        try {
            await user.roles.remove(CAUCUS_ROLES);
        } catch(e) {}

        // Add back their new caucus role
        if(caucus){
            try {
                await user.roles.add(caucus.Role);
            } catch(e) {}
        }
    }

    if (chamberChanged){
        // Update chamber role

        let chamberId = newEntry.Chamber.length > 0 ? newEntry.Chamber[0].value : null;

        let chamber = null;

        if(chamberId){
            chamber = (await getRow(DbTable.Chambers, UuidFields.Chambers, newEntry.Chamber[0].value)) as TableChamber | null;
        }

        // Remove all their caucus roles before giving them a new one

        try {
            await user.roles.remove(CHAMBER_ROLES);
        } catch(e) {}

        // Add back their new caucus role
        if(chamber){
            try {
                await user.roles.add(chamber.Role);
            } catch(e) {}
        }
    }

    if (raceChanged){
        // Update race role

        let raceId = newEntry.Race.length > 0 ? newEntry.Race[0].value : null;

        let race = null;

        if(raceId){
            race = (await getRow(DbTable.Races, UuidFields.Races, newEntry.Race[0].value)) as TableRace | null;
        }

        // Remove all their caucus roles before giving them a new one

        try {
            await user.roles.remove(RACE_ROLES);
        } catch(e) {}

        // Add back their new caucus role
        if(race){
            try {
                await user.roles.add(race.Role);
            } catch(e) {}
        }
    }

    if (partyChanged){

        // Update party role

        let partyId = newEntry.Party.length > 0 ? newEntry.Party[0].value : null;

        let party = null;

        if(partyId){
            party = (await getRow(DbTable.Parties, UuidFields.Parties, newEntry.Party[0].value)) as TableParty | null;
        }

        // Remove all their party roles before giving them a new one

        try {
            await user.roles.remove(PARTY_ROLES);
        } catch(e) {}

        // Add back their new party role
        if(party){
            try {
                await user.roles.add(party.Role);
            } catch(e) {}
        }

    }


    // UPDATE THE USER'S NICKNAME
    if (partyChanged || nicknameChanged || districtChanged || stateChanged) {
        // Update nickname

        let partyId = newEntry.Party.length > 0 ? newEntry.Party[0].value : null;

        let party: TableParty | null = null;
        if (partyId){
            party = (await getRow(DbTable.Parties, UuidFields.Parties, newEntry.Party[0].value)) as TableParty | null;
        }

        let state = newEntry.State.length > 0 ? newEntry.State[0].value as string : null;

        let district = newEntry.District as number | null;


        // Each individual item: i.e. in (CDU-VA-5) ["CDU", "VA", 5]
        let items = [];

        if(party) items.push(party.FormalId);
        if(state) items.push(state);
        if(district && district > 0) items.push(district);

        let suffix = "";

        if (items.length > 0){
            suffix = `(${items.join('-')})`;
        }

        try {
            await user.setNickname(`${newEntry.Nickname.substring(0, 31-suffix.length)} ${suffix}`)
        } catch(e){}



    }




}