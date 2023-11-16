import { EmbedBuilder } from "@discordjs/builders";
import DiscordClient from "../client";
import { DbTable, UuidFields, getRow, getSetting, listRows, updateMany } from "../db/database";
import { TableRace, TableSetting, TableUser } from "../models/Models";
import { EMOJI_SUCCESS } from "./statics";
import { Client } from "discord.js";

const RACE_FIELD = "field_1181473";

export async function updateDailyTokens(client: Client){

    const TOKEN_TRANSFER_RATIO = parseFloat(await getSetting("TokenTransferRatio") as string);
    const GENERAL_CHANNEL = await getSetting("GeneralChannel");


    let races = await listRows(DbTable.Races) as TableRace[];

    let racesToUpdate = races.filter((r => (!(r.TokensPerDay == 0 || !r.Active))));
    let rolesToPing = racesToUpdate.map(r => r.Role);

    let data: object[] = [];

    for(var race of racesToUpdate){

        let users = await listRows(DbTable.Users, `filter__${RACE_FIELD}__link_row_contains=${race.Uuid}`) as TableUser[];

        console.log(race.Name + " tokens updating for " + users.length + " users.");

        let tokensPerDay = race.TokensPerDay;

        users.forEach((user) => {
    
            let tokens = user.Tokens | 0;
    
            let transferredTokens = Math.round(tokens * TOKEN_TRANSFER_RATIO);
    
            data.push({
                "id": user.id,
                "Tokens": (transferredTokens + parseInt(tokensPerDay as any))
            });
            
    
        });

    }

    if(data.length == 0) return;

    await updateMany(DbTable.Users, data);

    
    if(GENERAL_CHANNEL){

        let channel = await client.channels.fetch(GENERAL_CHANNEL);

        if(!channel || !channel.isTextBased()) return;


        let embed = new EmbedBuilder()
            .setTitle(`:coin: Tokens Distributed!`)
            .setDescription(`Good morning LDE! Tokens have been updated for **${data.length} users!**\n` + 
            `Use \`/tokens\` to check your new :coin: token balance.\n\n` +
            `*½ of your unused campaign tokens transfer overnight. Campaign often to make the most of your tokens!*`)

        let roleMentions = rolesToPing.map(r => `<@&${r}>`).join(" ");

        channel.send({content: roleMentions, embeds: [embed], allowedMentions: { parse: ["roles"] }});
    }

}