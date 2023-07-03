import { AnyComponentBuilder, ButtonBuilder } from "@discordjs/builders";
import { DbTable, getPage } from "../db/database";
import { ActionRowBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, Interaction } from "discord.js";

var nextPage = new ButtonBuilder()
    .setCustomId('nextPage')
    .setLabel("Next ->")
    .setStyle(ButtonStyle.Primary);

var prevPage = new ButtonBuilder()
    .setCustomId('prevPage')
    .setLabel("<- Prev")
    .setStyle(ButtonStyle.Primary);

var currPage = new ButtonBuilder()
    .setCustomId('currPage')
    .setDisabled(true)
    .setStyle(ButtonStyle.Secondary)
    .setLabel("1/1");

export default class Paginator {

    interaction: CommandInteraction;
    dbTable: DbTable;
    size: number;
    startPage: number;
    page: number;
    baseEmbed: EmbedBuilder;
    fieldBuildFunction: Function;
    filter: string;

    constructor(interaction: any, dbTable: DbTable, size: number, baseEmbed: EmbedBuilder, fieldBuildFunction: Function, filter: string, startPage: number = 1){

        this.interaction = interaction;
        this.dbTable = dbTable;
        this.size = size;
        this.startPage = startPage;
        this.page = 1;
        this.baseEmbed = baseEmbed
        this.fieldBuildFunction = fieldBuildFunction
        this.filter = filter;
    }

    async changePage(diff: number){

        this.page += diff;

        console.log("CHECKING", this.page)

        let items = await getPage(this.dbTable, this.size, this.filter, this.page);

        currPage.setLabel(`${this.page}/${items.pages}`);

        if(items.pages == 0) items.pages = 1;


        if(this.page == items.pages) {
            nextPage.setDisabled(true);
        } else nextPage.setDisabled(false);

        if(this.page == 1){
            prevPage.setDisabled(true);
        } else prevPage.setDisabled(false);


        let firstItemIndex = (items.count > 0) ? ((this.page-1) * this.size + 1) : 0;
        let lastItemIndex = firstItemIndex + items.results.length - 1;

        this.baseEmbed.setFooter({text: `Showing ${firstItemIndex}-${lastItemIndex} of ${items.count}`});

        // GET CONTENT

        this.baseEmbed.setFields();

        for (var item of items.results){

            this.baseEmbed.addFields(this.fieldBuildFunction(item));

        }

        if (items.results.length == 0){
            this.baseEmbed.addFields({
                name: "No results",
                value: "Could not find any results that match the search criteria."
            })
        }



        const row = new ActionRowBuilder()
            .addComponents(prevPage, currPage, nextPage) as any;

        if(!this.interaction.replied){
            if(!this.interaction) return;
            await this.interaction.reply({embeds: [this.baseEmbed], components: [row]});
        } else {
            await this.interaction.editReply({embeds: [this.baseEmbed], components: [row]});
        }

        let filter = (btnInt: any) => { return this.interaction.user.id == btnInt.user.id };

        let collector = this.interaction.channel?.createMessageComponentCollector({filter, time: 6000, max: 1});

        if(!collector) return;



        this.interaction.channel?.awaitMessageComponent({filter: filter, time: 60000})
            .then(collected => {

                if(!collected) return;

                collected.deferUpdate();

                if(collected.customId == "nextPage"){
                    this.changePage(1)
                }
                else {
                    this.changePage(-1)
                }
            })
            .catch(collected => {

            })
        

    }




}