import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel, AttachmentBuilder } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../db/database";
import { TableCaucus, TableChamber, TableUser } from "../../models/Models";
import { notifyError, notifyNoCharacter, notifyOtherNoCharacter } from "../../util/response";
import { choice } from "../../util/math";
import { EMOJI_FINANCE, EMOJI_SUCCESS } from "../../util/statics";

const NEWS_AGENCIES: any = {
    "tnn": {
        "logo": "https://cdn.discordapp.com/attachments/1092538403960135831/1135626838488653847/tnn1996.png",
        "name": "Toad's News Network"
    },
    "cspan": {
        "logo": "https://cdn.discordapp.com/attachments/1092538403960135831/1125241498603102258/279624782_359365902899119_6959877162055776172_n.jpg",
        "name": "C-SPAN"
    }
}

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

        return await interaction.reply({content: `Here is <@${user.id}>'s campaign JSON:`, files: [
            attachment
        ]})

    }


}