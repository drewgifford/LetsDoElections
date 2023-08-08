import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ColorResolvable, GuildMemberRoleManager, ChatInputCommandInteraction } from "discord.js";
import { DbTable, UuidFields, getRow, getSetting, listRows, updateRow } from "../../../db/database";
import { TableCaucus, TableUser } from "../../../models/Models";
import { choice, nth } from "../../../util/math";
import { notifyError, notifyNoCharacter, notifyNotVerified } from "../../../util/response";
import { EMOJI_SUCCESS } from "../../../util/statics";
var _ = require("lodash")

let tips = [
    "Set your caucus with /caucus join",
    "Change your character's name with /character edit",
    "View a caucus's caucuses with /caucus list"
]



export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let caucusId = interaction.options.get("caucus", true).value as string;

        // TEST FOR VERIFICATION
        let verifiedRole = await getSetting("VerifiedRole");
        if(!verifiedRole) return;
        if(!interaction.guild) return;

        let member = await interaction.guild.members.fetch(interaction.user.id);

        if (!member || !(member.roles.cache.get(verifiedRole))){
            return await notifyNotVerified(interaction);
        }




        
        let caucus = (await getRow(DbTable.Caucuses, UuidFields.Caucuses, caucusId)) as TableCaucus;
        let userDb = (await getRow(DbTable.Users, UuidFields.Users, interaction.user.id)) as TableUser;

        // CHECK #0: Does the user have a character?
        if(!userDb){
            return await notifyNoCharacter(interaction);
        }

        if(!caucus){
            return await notifyError(interaction, "An error occured. The caucus was null?");
        }

        if(caucus.Locked){
            return await notifyError(interaction, "This race is locked.");
        }

        // CHECK #1: Does the user have a party?
        if (userDb.Party.length == 0){
            return await notifyError(interaction, "You do not have a party. Join a party with `/setparty`")
        }

        // CHECK #2: Is the user's party the same as the caucus?
        if (userDb.Party[0].value != caucus.Party[0].value){
            return await notifyError(interaction, "The caucus you are trying to join is not in your party.")
        }

        // CHECK #3: Does the user have a caucus?
        if (userDb.Caucus.length != 0){
            return await notifyError(interaction, "You are already in a caucus. If this is a mistake or you wish to switch caucuses, contact an admin.")
        }

        

        // GET EMOJI ID TO USE
        let emoji = caucus.Emoji

        if(!emoji){
            emoji = ""
        } else emoji = emoji + " "

        let members = caucus.Users.length + 1; // this is 2

        // Update user row
        let response = await updateRow(DbTable.Users, userDb.id, {
            "Caucus": [ caucus.id ]
        })

        if(!response){
            return await interaction.reply("An error occurred");
        }

        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_SUCCESS} Joined ${emoji}${caucus.Name} Caucus!`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })
            .setDescription(`You have successfully joined a caucus! You are the **${nth(members)}** member.`)
            .setColor(caucus.Color as ColorResolvable);




        interaction.reply({embeds: [embed]});


    }


}