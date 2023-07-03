import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import { notifyError } from "../../util/response";
import { DbTable, listRows } from "../../db/database";
import { TableState } from "../../models/Models";

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
                    .setName("title")
                    .setDescription("Vote Title")
                    .setRequired(true)
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