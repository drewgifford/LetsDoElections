import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { TableDocket } from "../../../models/Models";
import { choice } from "../../../util/math";


export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let docketId = interaction.options.get("docket", true).value as string;
        
        let docket = (await getRow(DbTable.Dockets, UuidFields.Dockets, docketId)) as TableDocket;





        let embed = new EmbedBuilder()
            .setTitle(`${docket.Emoji} ${docket.Name} Information`)
            .addFields(
            {
                name: `Overview`,
                value: `**Bills:** ${docket.Bills.length}`
            },
            {
                name: `Managers - ${docket.Managers.length}`, value: docket.Managers.map(m => `<@${m.value}>`).join(",") || "*No managers*"
            }
            
            )



        interaction.reply({embeds: [embed]});


    }


}