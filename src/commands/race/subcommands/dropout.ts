import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../../db/database";
import { TableRace, TableUser } from "../../../models/Models";
import { choice, nth } from "../../../util/math";
import { notifyError, notifyNoCharacter } from "../../../util/response";
import { EMOJI_SUCCESS } from "../../../util/statics";
var _ = require("lodash")

let tips = [
    "Join a race using /race join"
]



export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let userDb = (await getRow(DbTable.Users, UuidFields.Users, interaction.user.id)) as TableUser;

        // CHECK #0: Does the user have a character?
        if(!userDb){
            return await notifyNoCharacter(interaction);
        }

        // CHECK #1: Does the user have a race?
        if (!userDb.Race || userDb.Race.length == 0){
            return await notifyError(interaction, "You are not already in a race. Join a race using `/race join`")
        }

        let race = (await getRow(DbTable.Races, UuidFields.Races, userDb.Race[0].value)) as TableRace;

        // GET EMOJI ID TO USE
        let emoji = race.Emoji
        let emojiId = /(?:.*?:){2}(.*).+/.exec(emoji);
        
        let emojiUrl = undefined;

        if(emojiId){
            emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId[1]}.png`
        }

        // Update user row
        let response = await updateRow(DbTable.Users, userDb.id, {
            "Race": [],
            "Tokens": 0
        })

        if(!response){
            return await interaction.reply("An error occurred");
        }

        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_SUCCESS} Dropped out of ${race.Emoji} ${race.Name} Race`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })
            .setDescription(`You have successfully dropped out of the race.`)




        interaction.reply({embeds: [embed]});


    }


}