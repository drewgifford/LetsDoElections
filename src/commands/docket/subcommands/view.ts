import { CommandInteraction, EmbedBuilder, User } from "discord.js";
import { DbTable, UuidFields, getPage, getRow, listRows } from "../../../db/database";
import Paginator from "../../../paginate/Paginator";
import { TableBill, TableCaucus, TableDocket, TableParty } from "../../../models/Models";

const BILL_STATUS_EMOJIS: any = {
    "Not Introduced": "♨️",
    "Passed First": "☝️",
    "Passed Second": "✌️",
    "Vetoed": "😠",
    "Veto Overridden": "👿",
    "Signed": "🖊️",
    "Failed": "❌",
    "Tabled": "🪑"
}


export default {

    async execute(interaction: CommandInteraction) {

        let user = interaction.user;

        let docketId = interaction.options.get("docket", false)?.value as string | null;
        let partyId = interaction.options.get("party", false)?.value as string | null;
        let caucusId = interaction.options.get("caucus", false)?.value as string | null;
        let author = interaction.options.getUser("user", false) as User | null;
        let status = interaction.options.get("status", false)?.value as string | null;
        let showDescription = interaction.options.get("show_description", false) as boolean | null;

        if(showDescription == null) showDescription = true;

        let DOCKET_FIELD = "field_1182399"
        let PARTY_FIELD = "field_1182387"
        let CAUCUS_FIELD = "field_1182388"
        let AUTHOR_FIELD = "field_1182362"
        let STATUS_FIELD = "field_1182411"
        
        let filters = ["order_by=-Created"];
        let filterStrs = ["__**Active Filters:**__"];

        let embedTitle = "All Dockets";

        if(docketId != "all" && docketId){
            filters.push(`filter__${DOCKET_FIELD}__link_row_contains=${docketId}`);

            let docket = await getRow(DbTable.Dockets, UuidFields.Dockets, docketId) as TableDocket

            embedTitle = `${docket.Name} Docket`

        }
        if(status){

            filters.push(`filter__${STATUS_FIELD}__single_select_equal=${status}`);

            filterStrs.push(`**Status:** ${status}`);
        }
        if(partyId){
            filters.push(`filter__${PARTY_FIELD}__link_row_contains=${partyId}`);

            let party = await getRow(DbTable.Parties, UuidFields.Parties, partyId) as TableParty;

            filterStrs.push(`**Party:** ${party.Emoji} ${party.Name}`);
        }
        if(caucusId){
            filters.push(`filter__${CAUCUS_FIELD}__link_row_contains=${caucusId}`);

            let caucus = await getRow(DbTable.Caucuses, UuidFields.Caucuses, caucusId) as TableCaucus;

            filterStrs.push(`**Caucus:** ${caucus.Emoji ? (caucus.Emoji + ' ') : ''}${caucus.Name}`);
        }
        if(author){
            filters.push(`filter__${AUTHOR_FIELD}__link_row_contains=${author.id}`);
            filterStrs.push("**Author:** <@" + author.id + ">");
        }

        let filter = filters.join("&")


        let emojis: any = {};

        // GET PARTIES AND CAUCUS IDS AND SAVE THEM HERE FOR KEEPING
        (await listRows(DbTable.Parties) as TableParty[]).forEach(x => {
            emojis[x.Uuid] = x.Emoji
        });
        (await listRows(DbTable.Caucuses) as TableCaucus[]).forEach(x => {
            emojis[x.Uuid] = x.Emoji
        })



        function fieldBuildFunction(item: TableBill){

            let itemParty = item.Party[0].value;
            let itemCaucus = item.Caucus[0].value;

            let itemEmoji = "";

            if (itemCaucus in emojis){
                itemEmoji = emojis[itemCaucus] + " "; // Set the bill emoji to be caucus first
            } else if (itemParty in emojis){
                itemEmoji = emojis[itemParty] + " "; // If it's like a generic caucus or something, make it the party emoji instead
            } // otherwise no emoji :(

            let desc = showDescription == true ? ("*" + item.Description + "*\n") : ""

            console.log(item);

            return {
                name: `${itemEmoji}${item.Uuid} ${item.Name} - ${item.Cosponsors.length} cosponsors`,
                value: `**Author:** <@${item.Author[0].value}>\n**Status:** ${BILL_STATUS_EMOJIS[item.Status.value]} ${item.Status.value}\n${desc}[Click to view bill](${item.Url})`
            };

        }

        let baseEmbed = new EmbedBuilder()
            .setAuthor({
                name: embedTitle,
                url: "https://static.wikia.nocookie.net/the-microsoft-windows-xp/images/a/a4/Folder.png"
            })
        
        if (filterStrs.length > 1){
            baseEmbed.setDescription(filterStrs.join('\n'));
        }

        let size = 5;
        if(showDescription == false){
            size = 10;
        }

        let paginator = new Paginator(interaction, DbTable.Bills, size, baseEmbed, fieldBuildFunction, filter);

        await paginator.changePage(0);


    }

}