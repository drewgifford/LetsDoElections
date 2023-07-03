import { CommandInteraction, EmbedBuilder, User } from "discord.js";
import { DbTable, UuidFields, getPage, getRow, listRows } from "../../../db/database";
import Paginator from "../../../paginate/Paginator";
import { TableBill, TableCaucus, TableDocket, TableEvent, TableParty, TableRace } from "../../../models/Models";
import { BILL_STATUS_EMOJIS, EMOJI_DOCKET, EMOJI_RACE } from "../../../util/statics";




export default {

    async execute(interaction: CommandInteraction) {

        let user = interaction.user;

        let targetUser = interaction.options.getUser("user", false) as User | null;
        let eventType = interaction.options.get("type", false)?.value as string | null;
        let state = interaction.options.get("state", false)?.value as string | null;
        let race = interaction.options.get("race", false)?.value as string | null;


        const EVENT_TYPE_FIELD = "field_1186129";
        const USER_FIELD = "field_1186128";
        const STATES_FIELD = "field_1186134";
        const RACE_FIELD = "field_1186131";


        let embedTitle = "Showing Events in all Races";

        let filterStrs = ["__**Active Filters:**__"];
        let filters = ["order_by=-Created"];

        let titleEmoji = EMOJI_RACE;

        if(eventType){

            filters.push(`filter__${EVENT_TYPE_FIELD}__equal=${eventType}`);

        }

        if(targetUser){
            filters.push(`filter__${USER_FIELD}__link_row_contains=${targetUser.id}`);

            filterStrs.push(`**User:** <@${user.id}>`);
        }

        if(state){

            filters.push(`filter__${STATES_FIELD}__link_row_contains=${state}`);

            filterStrs.push(`**State:** ${state}`);
        }
        if(race){
            filters.push(`filter__${RACE_FIELD}__link_row_contains=${race}`);

            let raceDb = await getRow(DbTable.Races, UuidFields.Races, race) as TableRace;

            embedTitle = `Showing Events in ${raceDb.Emoji} ${raceDb.Name} Race`;
        }

        let filter = filters.join("&");


        function fieldBuildFunction(item: TableEvent){

            let itemUser = item.User[0].value;
            let itemTitle = item.Title;
            let itemType = item.EventType;
            let itemStates: string[] = item.States.map(s => s.value);
            let itemCreated = Date.parse(item.Created);

            return {
                name: `${itemTitle}`,
                value: `**User:** <@${itemUser}>\n**States: \`${itemStates.join(',')}\`**\n**Type:** ${itemType}\n**Sent:** <t:${Math.round(itemCreated/1000)}>\n\n${item.Description.substring(0, 800)}\n[Link to campaign message](${item.MessageUrl})`
            };

        }

        let baseEmbed = new EmbedBuilder()
            .setTitle(`${titleEmoji} ${embedTitle}`)

        let size = 1;

        let paginator = new Paginator(interaction, DbTable.Events, size, baseEmbed, fieldBuildFunction, filter);

        await paginator.changePage(0);


    }

}