import { EmbedBuilder } from "@discordjs/builders";
import DiscordClient from "../client";
import { TableBill, TableDocket } from "../models/Models";
import { BILL_STATUS_EMOJIS } from "./statics";

export default async function addToDocket(client: DiscordClient, bill: TableBill, docket: TableDocket){
    

    let channelId = docket.Channel;
    let channel = await client.channels.fetch(channelId);

    if(!channel || !channel.isTextBased()) return;

    let history = bill.History.split(",").map(b => `\`${b}\``);

    let embed = new EmbedBuilder()

        .setTitle(`${bill.Uuid} ${bill.Name}`)
        .setDescription(`**Author:** <@${bill.Author[0].value}>`)
        .addFields(
            {
                name: "Status",
                value: `${BILL_STATUS_EMOJIS[bill.Status.value]} __${bill.Status.value}__`
            },
            {
                name: "Last Updated",
                value: `<t:${Math.round(Date.parse(bill.Edited)/1000)}:R>`
            },
            {
                name: "First Introduced",
                value: `<t:${Math.round(Date.parse(bill.Created)/1000)}>`
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

        

    await channel.send({embeds: [embed]});





}