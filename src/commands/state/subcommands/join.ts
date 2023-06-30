import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../../db/database";
import { TableState, TableUser } from "../../../models/Models";
import { choice, nth } from "../../../util/math";
import { notifyError, notifyNoCharacter } from "../../../util/response";
import { EMOJI_SUCCESS } from "../../../util/statics";
var _ = require("lodash")

let tips = [
    "Set your district with /district join",
    "Change your character's name with /character edit",
]



export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let stateId = interaction.options.get("state", true).value as string;
        
        let state = (await getRow(DbTable.States, UuidFields.States, stateId)) as TableState;
        let userDb = (await getRow(DbTable.Users, UuidFields.Users, interaction.user.id)) as TableUser;

        // CHECK #0: Does the user have a character?
        if(!userDb){
            return await notifyNoCharacter(interaction);
        }

        if(state.Locked){
            return await notifyError(interaction, "This race is locked.");
        }

        if(!state){
            return await notifyError(interaction, `The state ${stateId} doesn't exist.`)
        }

        // CHECK #1: Does the user have a state?
        if (userDb.State.length != 0){
            return await notifyError(interaction, "You are already in a state. If this is a mistake or you wish to switch states, contact an admin.")
        }


        let members = state.Users.length + 1; // this is 2

        // Update user row
        let response = await updateRow(DbTable.Users, userDb.id, {
            "State": [ state.id ]
        })

        if(!response){
            return await interaction.reply("An error occurred");
        }

        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_SUCCESS} Joined ${state.Name}!`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })
            .setDescription(`You have successfully joined a state! You are the **${nth(members)}** member.`)




        interaction.reply({embeds: [embed]});


    }


}