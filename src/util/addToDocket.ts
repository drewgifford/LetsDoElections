import { EmbedBuilder } from "@discordjs/builders";
import DiscordClient from "../client";
import { TableBill, TableDocket, TableUser } from "../models/Models";
import { BILL_STATUS_EMOJIS } from "./statics";
import { DbTable, UuidFields, getRow } from "../db/database";

export default async function addToDocket(client: DiscordClient, bill: TableBill, docket: TableDocket){
    

    let channelId = docket.Channel;
    let channel = await client.channels.fetch(channelId);

    if(!channel || !channel.isTextBased()) return;

    let user = (await getRow(DbTable.Users, UuidFields.Users, bill.Author[0].value)) as TableUser;

    

    let history = bill.History.split(",").map(b => `\`${b}\``);

    let embed = new EmbedBuilder()

        .setTitle(`${bill.Uuid} ${bill.Name}`)
        .setDescription(`**Author:** <@${bill.Author[0].value}>\n${bill.Description}`)
        .addFields(
            {
                name: "Status",
                value: `${BILL_STATUS_EMOJIS[bill.Status.value]} __${bill.Status.value}__`
            },
            {
                name: "Last Updated",
                value: `<t:${Math.round(Date.parse(bill.Edited)/1000)}:R>`,
                inline: true,
            },
            {
                name: "First Introduced",
                value: `<t:${Math.round(Date.parse(bill.Created)/1000)}>`,
                inline: true,
            },
            {
                name: "Bill History",
                value: `${history.join(' → ')}`
            }
        )
        .setColor(0xE6771F)

        try {
            embed.setURL(bill.Url)
        } catch(e) {};

    if (user.Faceclaim){
        try {
            embed.setThumbnail(user.Faceclaim);
        } catch(e){}
    }

    await channel.send({embeds: [embed]});





}