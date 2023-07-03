import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { notifyError } from "../../util/response";

const infoCommand = require("./subcommands/info");
const joinCommand = require("./subcommands/join");
const listCommand = require("./subcommands/list");
const addwhipCommand = require("./subcommands/addwhip");
const removewhipCommand = require("./subcommands/removewhip");

export default {

    data: new SlashCommandBuilder()
        .setName("party")
        .setDescription("Various commands relating to parties")
        .addSubcommand(subcommand => 
            subcommand
                .setName("info")
                .setDescription("Detailed information about a party")
                .addStringOption(option =>
                    option.addChoices(
                        { name: "Democratic", value: "D" },
                        { name: "Liberty Coalition", value: "L" },
                        { name: "Christian Democratic Union", value: "C" },
                        { name: "Independent", value: "I" }
                    )
                    .setName("party")
                    .setDescription("Party to view")
                    .setRequired(true)
                ),   
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("join")
                .setDescription("Sets your character's party")
                .addStringOption(option =>
                    option.addChoices(
                        { name: "Democratic", value: "D" },
                        { name: "Liberty Coalition", value: "L" },
                        { name: "Christian Democratic Union", value: "C" },
                        { name: "Independent", value: "I" }
                    )
                .setName("party")
                .setDescription("Party to join")
                .setRequired(true)
            )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("Lists all active parties")
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("addwhip")
            .setDescription("ADMIN ONLY - Adds a whip to a party")
            .addStringOption(option =>
                option.addChoices(
                    { name: "Democratic", value: "D" },
                    { name: "Liberty Coalition", value: "L" },
                    { name: "Christian Democratic Union", value: "C" },
                    { name: "Independent", value: "I" }
                )
                .setName("party")
                .setDescription("Party to modify")
                .setRequired(true)
            )
            .addUserOption(option => option.setName('user').setDescription('User to manage').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("removewhip")
            .setDescription("ADMIN ONLY - Removes a whip from a party")
            .addStringOption(option =>
                option.addChoices(
                    { name: "Democratic", value: "D" },
                    { name: "Liberty Coalition", value: "L" },
                    { name: "Christian Democratic Union", value: "C" },
                    { name: "Independent", value: "I" }
                )
                .setName("party")
                .setDescription("Party to modify")
                .setRequired(true)
            )
            .addUserOption(option => option.setName('user').setDescription('User to manage').setRequired(true))
        ),

        
    execute: async function(interaction: ChatInputCommandInteraction){

        console.log(interaction.options.getSubcommand());

        switch(interaction.options.getSubcommand()){
            case "join":
                return await joinCommand.default.execute(interaction);
            case "list":
                return await listCommand.default.execute(interaction);
            case "info":
                return await infoCommand.default.execute(interaction);
            case "addwhip":
                return await addwhipCommand.default.execute(interaction);
            case "removewhip":
                return await removewhipCommand.default.execute(interaction);
            
            default:
                return await notifyError(interaction, "Unknown error. Code 42");


        }
    }


}