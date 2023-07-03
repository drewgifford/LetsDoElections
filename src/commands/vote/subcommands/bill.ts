import { ButtonBuilder, EmbedBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, Emoji } from "discord.js";
import { EMOJI_CHARACTER, EMOJI_DOCKET, EMOJI_ERROR, EMOJI_SUCCESS } from "../../../util/statics";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { TableCaucus, TableChamber, TableParty } from "../../../models/Models";
import { notifyError } from "../../../util/response";

let VOTING_CHANNELS: string[] = [];

// BUTTONS!
const buttonAye = new ButtonBuilder()
    .setCustomId("aye")
    .setLabel(`Aye`)
    .setStyle(ButtonStyle.Success)

const buttonNay = new ButtonBuilder()
    .setCustomId("nay")
    .setLabel(` Nay`)
    .setStyle(ButtonStyle.Danger)

const buttonPresent = new ButtonBuilder()
    .setCustomId("present")
    .setLabel(`Present`)
    .setStyle(ButtonStyle.Secondary)

const buttonEnd = new ButtonBuilder()
    .setCustomId("endVote")
    .setLabel(`End Vote`)
    .setStyle(ButtonStyle.Secondary)

const actionRow = new ActionRowBuilder()
    .addComponents(buttonAye, buttonNay, buttonPresent, buttonEnd) as any;

const VOTE_TYPES = ["aye", "nay", "present"];

export default {

    execute: async function(interaction: ChatInputCommandInteraction){


        let chamberId = interaction.options.get("chamber", true).value as string;
        
        
        let title = interaction.options.get("title", true).value as string;

        let chamber = (await getRow(DbTable.Chambers, UuidFields.Chambers, chamberId)) as TableChamber;

        let managers = chamber.Managers.map(m => m.value);

        if (!managers.includes(interaction.user.id)){
            return await notifyError(interaction, `You are not a manager of the ${chamber.Emoji} ${chamber.Name}.`);
        }

        if (VOTING_CHANNELS.includes(interaction.channelId)){
            return await notifyError(interaction, "A vote is currently taking place in this channel.");
        }


        // GET ALL CAUCUSES AND PARTIES
        let parties = (await listRows(DbTable.Parties)) as TableParty[];
        let caucuses = (await listRows(DbTable.Caucuses)) as TableCaucus[];

        var voteObject: any = {}

        function calculateVotes(){

            let tally: any = {};

            VOTE_TYPES.forEach(v => {
                tally[v] = {}
                caucuses.forEach(c => tally[v][c.Uuid] = 0);
            });

            // Get all of the raw votes first

            Object.keys(voteObject).forEach(uid => {

                let caucus = caucuses.find(c => c.Users.map(u => u.value).includes(uid));

                if(!caucus) return;

                let theirVote = voteObject[uid];

                tally[theirVote][caucus.Uuid] += 1;
            });

            let totalVotes: any = {};

            VOTE_TYPES.forEach(v => {

                Object.keys(tally[v]).forEach(c => {

                    if (!(c in totalVotes)) totalVotes[c] = 0;
                    totalVotes[c] += tally[v][c]

                });

            });

            // Look for caucus whips first
            caucuses.forEach(c => {

                let whips = c.Whips.map(w => w.value);
                let seats = JSON.parse(c.Seats)[chamber.Uuid] as number || 0;
                let cont = true;
                Object.keys(voteObject).reverse().forEach(k => {
                    if(!cont) return;

                    if(whips.includes(k)){

                        tally[voteObject[k]][c.Uuid] += (seats - (c.Uuid in totalVotes ? totalVotes[c.Uuid] : 0));
                        cont = false;
                    }

                });

                if(!cont) return;

                // No whip voted, check for the party whip
                let party = parties.find(p => p.Caucuses.map(d => d.value).includes(c.Uuid)) as TableParty;
                let partyWhips = party.Whips.map(w => w.value);

                console.log(partyWhips);

                Object.keys(voteObject).reverse().forEach(k => {
                    if(!cont) return;

                    if (partyWhips.includes(k)){

                        tally[voteObject[k]][c.Uuid] += (seats - (c.Uuid in totalVotes ? totalVotes[c.Uuid] : 0));
                        cont = false;

                    }
                })

            });

            return tally;

        }

        function getTotalVotes(tally: any, voteType: string){

            let total = 0;
            Object.keys(tally[voteType]).forEach(key => {
                total += tally[voteType][key];
            });
            return total;

        }

        function getCaucusVotes(tally: any, voteType: string, caucusId: string){
            let number = tally[voteType][caucusId];
            return number;
        }
        function getCaucusVoteString(tally: any, voteType: string){

            let strs: string[] = [];

            caucuses.forEach(c => {

                let votes = getCaucusVotes(tally, voteType, c.Uuid);
                if(votes == 0) return;

                let str = `${c.Emoji} ${c.Name} - ${getCaucusVotes(tally, voteType, c.Uuid) || 0}`;
                strs.push(str);

            });

            let users: string[] = []
            Object.keys(voteObject).forEach(u => {
                if(voteObject[u] == voteType) users.push(`<@${u}>`);
            });
            strs.push(users.join(', '));


            return strs.join('\n') || "*No Votes*";
        }


        function getEmbed(){

            let tally = calculateVotes();


            return new EmbedBuilder()
            .setTitle(`${EMOJI_DOCKET} ${title}`)
            .addFields(
                {
                    name: `${EMOJI_SUCCESS} Ayes - ${getTotalVotes(tally, "aye")}`,
                    value: getCaucusVoteString(tally, 'aye'),
                    inline: true
                },
                {
                    name: "\u200b",
                    value: "\u200b",
                    inline: true
                },
                {
                    name: `${EMOJI_ERROR} Nays - ${getTotalVotes(tally, "nay")}`,
                    value : getCaucusVoteString(tally, 'nay'),
                    inline: true,
                },
                {
                    name: `${EMOJI_CHARACTER} Presents - ${getTotalVotes(tally, "present")}`,
                    value: getCaucusVoteString(tally, 'present')
                }
            )
        }



        async function update(){

            let embed = getEmbed();

            if(interaction.replied){
                await interaction.editReply({embeds: [embed], components: [actionRow]})
            } else {
                await interaction.reply({embeds: [embed], components: [actionRow]})
            }
        }
        VOTING_CHANNELS.push(interaction.channelId);


        await update();


        let validUserIds = chamber.Users.map(u => u.value);
        console.log(validUserIds);



        let filter = (btnInt: any) => { return validUserIds.includes(btnInt.user.id) };

        let collector = interaction.channel?.createMessageComponentCollector({filter});

        if(!collector){
            return await interaction.followUp("An error has occurred.");
        }

        async function endVote(){

            collector?.stop();

            let embed = getEmbed();
            embed.setFooter({text: "This vote has ended."})

            if(interaction.replied){
                await interaction.editReply({embeds: [embed], components: []})
            } else {
                await interaction.reply({embeds: [embed], components: []})
            }
            VOTING_CHANNELS.splice(VOTING_CHANNELS.indexOf(interaction.channelId), 1);
            
        }

        collector.on("collect", m => {
            
            m = m as ButtonInteraction;

            m.deferUpdate();

            let customId = m.customId;
            let userId = m.user.id;


            if(customId == "endVote"){

                if (m.user.id != interaction.user.id){
                    return notifyError(m, "Only the person who started this vote can end it.");
                }

                return endVote();
            }

            if(Object.keys(voteObject).includes(userId)){
                delete voteObject[userId];
            }

            voteObject[userId] = customId;

            return update();

        })


        














    }


}