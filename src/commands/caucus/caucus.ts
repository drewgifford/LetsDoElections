import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { notifyError } from "../../util/response";

const infoCommand = require("./subcommands/info");
const joinCommand = require("./subcommands/join");
const listCommand = require("./subcommands/list");

export default {

    data: new SlashCommandBuilder()
        .setName("caucus")
        .setDescription("Various commands relating to caucuses")
        .addSubcommand(subcommand => 
            subcommand
                .setName("info")
                .setDescription("Detailed information about a caucus")
                .addStringOption(option =>
                    option.addChoices(
                        { name: "D - Blue Dog", value: "d-bluedog" },
                        { name: "D - New Democrats", value: "d-newdem" },
                        { name: "D - Progressive", value: "d-progressive" },
                        { name: "I - Right-Wing", value: "i-right" },
                        { name: "I - Centrist", value: "i-center"},
                        { name: "I - Left-Wing", value: "i-left"}
                    )
                    .setName("caucus")
                    .setDescription("Caucus to view")
                    .setRequired(true)
                ))
        .addSubcommand(subcommand => 
            subcommand
                .setName("join")
                .setDescription("Sets your character's caucus")
                .addStringOption(option =>
                    option.addChoices(
                        { name: "D - Blue Dog", value: "d-bluedog" },
                        { name: "D - New Democrats", value: "d-newdem" },
                        { name: "D - Progressive", value: "d-progressive" },
                        { name: "I - Right-Wing", value: "i-right" },
                        { name: "I - Centrist", value: "i-center"},
                        { name: "I - Left-Wing", value: "i-left"},
                        { name: "LC - Generic", value: "lc-generic"},
                        { name: "CDU - Generic", value: "cdu-generic"},
                    )
                    .setName("caucus")
                    .setDescription("Caucus to join")
                    .setRequired(true)
                ))
        .addSubcommand(subcommand =>
            subcommand
            .setName("list")
            .setDescription("Lists all active caucuses of a party")
            .addStringOption(option =>
                option.addChoices(
                    { name: "Democratic", value: "D" },
                    { name: "Liberty Coalition", value: "L" },
                    { name: "Christian Democratic Union", value: "C" },
                    { name: "Independent", value: "I" }
                )
                .setName("party")
                .setDescription("Party to view caucuses of")
                .setRequired(true)
            ))
    ,
        

        
    execute: async function(interaction: ChatInputCommandInteraction){

        console.log(interaction.options.getSubcommand());

        switch(interaction.options.getSubcommand()){
            case "join":
                return await joinCommand.default.execute(interaction);
            case "list":
                return await listCommand.default.execute(interaction);
            case "info":
                return await infoCommand.default.execute(interaction);
            default:
                return await notifyError(interaction, "Unknown error. Code 42");


        }
    }


}