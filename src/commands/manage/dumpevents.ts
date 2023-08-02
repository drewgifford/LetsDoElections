import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel, AttachmentBuilder } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../db/database";
import { TableCaucus, TableChamber, TableUser } from "../../models/Models";
import { notifyError, notifyNoCharacter, notifyOtherNoCharacter } from "../../util/response";
import { choice } from "../../util/math";
import { EMOJI_FINANCE, EMOJI_SUCCESS } from "../../util/statics";
import axios from "axios"
import querystring from "querystring";

require("dotenv").config();

const PASTEBIN_KEY = process.env.PASTEBIN_KEY;

export default {
    
    data: new SlashCommandBuilder()
        .setName("dumpevents")
        .setDescription("Dumps all of a user's events into ")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addUserOption(option =>
            option
            .setName("user")
            .setDescription("User to get events from")
            .setRequired(true)
        ),


    async execute(interaction: ChatInputCommandInteraction) { 

        let user = interaction.options.getUser("user", true);

        let USER_FIELD = "field_1186128";

        let events = (await listRows(DbTable.Events, `filter__${USER_FIELD}__link_row_contains=${user.id}`));

        let json = JSON.stringify(events);

        let attachment = new AttachmentBuilder(Buffer.from(json), { name : `${user.username}-campaign.json` });

        await interaction.deferReply();

        axios.post(
            "https://pastebin.com/api/api_post.php",
            querystring.stringify({
                api_dev_key: PASTEBIN_KEY,
                api_option: "paste",
                api_paste_code: json,
                api_paste_format: "json",
                api_paste_expire_data: "1W"

            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        ).then((response) => {
            
            interaction.reply({content: `[Click here to view ${user.username}'s campaign](http://letsdoelections.com/campaign?id=${response.data.replace("https://pastebin.com/","")})`, files: [
                attachment
            ]})

        }).catch(e => {
            console.warn(e);

            interaction.followUp({content: `An error occured when uploading to Pastebin. Here is the raw JSON to manually input:`, files: [
                attachment
            ]})
        });

       

    }


}