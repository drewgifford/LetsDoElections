import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, UuidFields, getRow, getSetting, listRows, updateRow } from "../../../db/database";
import { TableParty, TableUser } from "../../../models/Models";
import { choice, nth } from "../../../util/math";
import { notifyError, notifyNoCharacter, notifyNotVerified } from "../../../util/response";
import { EMOJI_SUCCESS } from "../../../util/statics";
var _ = require("lodash")

let tips = [
    "Set your caucus with /caucus join",
    "Change your character's name with /character edit",
    "View a party's caucuses with /caucus list"
]



export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let partyId = interaction.options.get("party", true).value as string;

        // TEST FOR VERIFICATION
        let verifiedRole = await getSetting("VerifiedRole");
        if(!verifiedRole) return;
        if(!interaction.member) return;

        if (!(verifiedRole in interaction.member.roles)){
            return await notifyNotVerified(interaction);
        }
        
        let party = (await getRow(DbTable.Parties, UuidFields.Parties, partyId)) as TableParty;
        let userDb = (await getRow(DbTable.Users, UuidFields.Users, interaction.user.id)) as TableUser;

        // CHECK #0: Does the user have a character?
        if(!userDb){
            return await notifyNoCharacter(interaction);
        }

        if(party.Locked){
            return await notifyError(interaction, "This race is locked.");
        }

        // CHECK #1: Does the user have a party?
        if (userDb.Party.length != 0){
            return await notifyError(interaction, "You are already in a party. If this is a mistake or you wish to switch parties, contact an admin.")
        }

        // GET EMOJI ID TO USE
        let emoji = party.Emoji
        let emojiId = /(?:.*?:){2}(.*).+/.exec(emoji);
        
        let emojiUrl = undefined;

        if(emojiId){
            emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId[1]}.png`
        }

        let members = party.Users.length + 1; // this is 2

        // Update user row
        let response = await updateRow(DbTable.Users, userDb.id, {
            "Party": [ party.id ]
        })

        if(!response){
            return await interaction.reply("An error occurred");
        }

        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_SUCCESS} Joined ${party.Emoji} ${party.Name} Party!`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })
            .setDescription(`You have successfully joined a party! You are the **${nth(members)}** member.`)




        interaction.reply({embeds: [embed]});


    }


}