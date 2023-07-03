import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../../db/database";
import { TableRace, TableUser } from "../../../models/Models";
import { choice, nth } from "../../../util/math";
import { notifyError, notifyNoCharacter } from "../../../util/response";
import { EMOJI_SUCCESS } from "../../../util/statics";
var _ = require("lodash")

let tips = [
    "Set your caucus with /caucus join",
    "Change your character's name with /character edit",
    "View a race's caucuses with /caucus list"
]



export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let raceId = interaction.options.get("race", true).value as string;
        
        let race = (await getRow(DbTable.Races, UuidFields.Races, raceId)) as TableRace;
        let userDb = (await getRow(DbTable.Users, UuidFields.Users, interaction.user.id)) as TableUser;

        // CHECK #0: Does the user have a character?
        if(!userDb){
            return await notifyNoCharacter(interaction);
        }


        if(race.Locked){
            return await notifyError(interaction, "This race is locked.");
        }


        // CHECK #1: Does the user have a race?
        if (userDb.Race.length != 0){
            return await notifyError(interaction, "You are already in a race. If this is a mistake, contact an admin.")
        }

        // CHECK #2: Does this user have a party?
        if (!userDb.Party || userDb.Party.length == 0){
            return await notifyError(interaction, "You do not have a party. Join a party using `/party join`.")
        }

        // CHECK #3: Does this user have a caucus?
        if (!userDb.Caucus || userDb.Caucus.length == 0){
            return await notifyError(interaction, "You do not have a caucus. Join a caucus using `/caucus join`.")
        }

        // CHECK #4: Does this user have a state?
        if (!userDb.State || userDb.State.length == 0){
            return await notifyError(interaction, "You do not have a state. Join a state using `/state join`.")
        }

        // CHECK #5: Does this user have a district?
        if (!userDb.District || userDb.District <= 0){
            return await notifyError(interaction, "You do not have a district. Join a district using `/district join`.")
        }

        let states = race.States;

        if (states.length != 0){

            let state = userDb.State[0].value;

            if(!states.map(s => s.value).includes(state)){
                return await notifyError(interaction, `The seat represented by ${state} is not up this election.`)
            }

        }


        let members = race.Users.length + 1; // this is 2

        // Update user row
        let response = await updateRow(DbTable.Users, userDb.id, {
            "Race": [ race.Uuid ]
        })

        if(!response){
            return await interaction.reply("An error occurred");
        }

        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_SUCCESS} Joined ${race.Emoji} ${race.Name} Race!`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })
            .setDescription(`You have successfully joined the race! You are the **${nth(members)}** member.`)




        interaction.reply({embeds: [embed]});


    }


}