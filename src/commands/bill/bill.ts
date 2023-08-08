import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import { notifyError } from "../../util/response";
import { DbTable, listRows } from "../../db/database";
import { TableBill } from "../../models/Models";

const infoCommand = require("./subcommands/info");
const editCommand = require("./subcommands/edit")
const cosponsorCommand = require("./subcommands/cosponsor");

export default {

    data: new SlashCommandBuilder()
        .setName("bill")
        .setDescription("Various commands relating to bills")
        .addSubcommand(subcommand => 
            subcommand
                .setName("info")
                .setDescription("Detailed information about a bill")
                .addStringOption(option =>
                    option
                    .setName("bill")
                    .setDescription("Bill to view")
                    .setRequired(true)
                    .setAutocomplete(true)
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("cosponsor")
                .setDescription("Cosponsors a bill")
                .addStringOption(option =>
                    option
                    .setName("bill")
                    .setDescription("Bill to cosponsor")
                    .setRequired(true)
                    .setAutocomplete(true)
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("edit")
                .setDescription("Edits the status of a bill, or move it to a new docket")
                .addStringOption(option =>
                    option
                    .setName("bill")
                    .setDescription("Bill to cosponsor")
                    .setRequired(true)
                    .setAutocomplete(true)
                )
                .addStringOption(option =>
                    option
                    .setName("docket")
                    .setDescription("New bill docket")
                    .setRequired(false)
                    .addChoices(
                        {name: "House", value: "house"},
                        {name: "Senate", value: "senate"},
                        {name: "Executive", value: "executive"},
                        {name: "Law", value: "law"}
                    )
                )
                .addStringOption(option =>
                    option
                    .setName("status")
                    .setDescription("New bill status")
                    .setRequired(false)
                    .addChoices(
                        {name: "Not Introduced", value: "Not Introduced"},
                        {name: "Passed First", value: "Passed First"},
                        {name: "Passed Second", value: "Passed Second"},
                        {name: "Vetoed", value: "Vetoed"},
                        {name: "Veto Overridden", value: "Veto Overridden"},
                        {name: "Signed", value: "Signed"},
                        {name: "Tabled", value: "Tabled"}
                    )
                )
        ),

    autocomplete: async function(interaction: AutocompleteInteraction){

        const focusedValue = interaction.options.getFocused();

        let searchParam = `search=${focusedValue}&`
        if (focusedValue == ""){
            searchParam = ""
        }

        let bills = (await listRows(DbTable.Bills, `${searchParam}size=25&order_by=-Created`)) as TableBill[]


        let filtered = bills.map(b => [`${b.Uuid} ${b.Name}`.substring(0, 99), b.Uuid]);

        await interaction.respond(
            filtered.map(choice => ({name: choice[0], value: choice[1]}))
        );

    },
        
    execute: async function(interaction: ChatInputCommandInteraction){


        switch(interaction.options.getSubcommand()){
            case "info":
                return await infoCommand.default.execute(interaction);
            case "cosponsor":
                return await cosponsorCommand.default.execute(interaction);
            case "edit":
                return await editCommand.default.execute(interaction);
            default:
                return await notifyError(interaction, "Unknown error. Code 42");


        }
    }


}