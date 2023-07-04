import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import { notifyError } from "../../util/response";
import { DbTable, listRows } from "../../db/database";
import { TableBill, TableState } from "../../models/Models";

const billCommand = require("./subcommands/bill");
const secondsCommand = require("./subcommands/seconds");
const endCommand = require("./subcommands/end");

export default {

    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Voting commands")

        .addSubcommand(subcommand =>
            subcommand
                .setName("bill")
                .setDescription("Starts a vote with Aye/Nay/Present options")
                .addStringOption(option =>
                    option
                    .setName("chamber")
                    .setDescription("Chamber to vote in")
                    .setRequired(true)
                    .addChoices(
                        {name: "House of Representatives", value:"house"},
                        {name:"Senate", value:"senate"}
                    )
                )
                .addStringOption(option =>
                    option
                    .setName("bill")
                    .setDescription("Bill to vote on")
                    .setRequired(true)
                    .setAutocomplete(true)
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("seconds")
                .setDescription("Starts a vote with Second/Objection! options")
                .addStringOption(option =>
                    option
                    .setName("chamber")
                    .setDescription("Chamber to vote in")
                    .setRequired(true)
                    .addChoices(
                        {name: "House of Representatives", value:"house"},
                        {name:"Senate", value:"senate"}
                    )
                )
                .addStringOption(option => 
                    option
                    .setName("description")
                    .setDescription("Vote Description")
                    .setRequired(true)
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("end")
                .setDescription("Ends a vote")
                .addStringOption(option =>
                    option.setName("chamber")
                    .setDescription("Chamber to end the vote in")
                    .setRequired(true)
                    .addChoices(
                        {name: "House of Representatives", value:"house"},
                        {name: "Senate", value: "senate"}
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


        let filtered = bills.map(b => [`${b.Uuid} ${b.Name}`, b.Uuid]);

        await interaction.respond(
            filtered.map(choice => ({name: choice[0], value: choice[1]}))
        );

    },
        
    execute: async function(interaction: ChatInputCommandInteraction){

        console.log(interaction.options.getSubcommand());

        switch(interaction.options.getSubcommand()){
            case "bill":
                return await billCommand.default.execute(interaction);
            default:
                return await notifyError(interaction, "Unknown error. Code 42");


        }
    }


}