import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, UuidFields, getRow, getSetting, listRows, updateRow } from "../../../db/database";
import { TableState, TableUser } from "../../../models/Models";
import { choice, nth } from "../../../util/math";
import { notifyError, notifyNoCharacter, notifyNotVerified } from "../../../util/response";
var _ = require("lodash")

let tips = [
    "Set your caucus with /caucus join",
    "Change your character's name with /character edit",
    "View a state's caucuses with /caucus list"
]



export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let district: number = interaction.options.getInteger("district") as number;
        let userDb = (await getRow(DbTable.Users, UuidFields.Users, interaction.user.id)) as TableUser;

        // TEST FOR VERIFICATION
        let verifiedRole = await getSetting("VerifiedRole");
        if(!verifiedRole) return;
        if(!interaction.member) return;

        if (!(verifiedRole in interaction.member.roles)){
            return await notifyNotVerified(interaction);
        }

        // CHECK #0: Does the user have a character?
        if(!userDb){
            return await notifyNoCharacter(interaction);
        }

        console.log(userDb);

        let stateId = userDb.State.length > 0 ? userDb.State[0].value : null;

        if(!stateId){
            return await notifyError(interaction, `You are not in a state yet. To join a state, use /state join`)
        }

        let state = (await getRow(DbTable.States, UuidFields.States, stateId)) as TableState;

        console.log(state);

        // CHECK #1: Does the user have a district?
        if (userDb.District || userDb.District > 0){
            return await notifyError(interaction, "You are already in a district. If this is a mistake or you wish to switch districts, contact an admin.")
        }

        // CHECK #2: Is this a valid district?
        if (district <= 0 || district > state.Districts){
            return await notifyError(interaction, `The district \`${district}\` is not valid in ${state.Name}.`);
        }


        // Update user row
        let response = await updateRow(DbTable.Users, userDb.id, {
            "District": interaction.options.getInteger("district")
        })

        if(!response){
            return await interaction.reply("An error occurred");
        }

        let embed = new EmbedBuilder()
            .setAuthor({
                name: `Joined ${state.Uuid}-${district}!`,
                iconURL: "https://flagcdn.com/40x30/us-" + state.Uuid.toLowerCase() + ".png"
            })
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })
            .setDescription(`You have successfully joined the \`${state.Uuid}-${district}\` district!`)




        interaction.reply({embeds: [embed]});


    }


}