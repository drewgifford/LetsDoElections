import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { notifyError } from "../../util/response";
import { SubCommand } from "../../models/Models";

const infoCommand = require("./subcommands/info");
const joinCommand = require("./subcommands/join");
const listCommand = require("./subcommands/list");
const addwhipCommand = require("./subcommands/addwhip");
const removewhipCommand = require("./subcommands/removewhip");

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
                        { name: "UCP - Patriot", value: "ucp-patriot" },
                        { name: "UCP - Lincoln", value: "ucp-lincoln" },
                        { name: "UCP - Liberty", value: "ucp-liberty" },
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
                        { name: "UCP - Patriot", value: "ucp-patriot" },
                        { name: "UCP - Lincoln", value: "ucp-lincoln" },
                        { name: "UCP - Liberty", value: "ucp-liberty" },
                        { name: "I - Generic", value: "i-generic" },
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
                    { name: "United Conservative Party", value: "U" },
                    { name: "Independent", value: "I" }
                )
                .setName("party")
                .setDescription("Party to view caucuses of")
                .setRequired(true)
            ))

        .addSubcommand(subcommand =>
            subcommand
            .setName("addwhip")
            .setDescription("ADMIN ONLY - Adds a whip to a caucus")
            .addStringOption(option =>
                option.addChoices(
                    { name: "D - Blue Dog", value: "d-bluedog" },
                    { name: "D - New Democrats", value: "d-newdem" },
                    { name: "D - Progressive", value: "d-progressive" },
                    { name: "UCP - Patriot", value: "ucp-patriot" },
                    { name: "UCP - Lincoln", value: "ucp-lincoln" },
                    { name: "UCP - Liberty", value: "ucp-liberty" },
                    { name: "I - Generic", value: "i-generic" },
                )
                .setName("caucus")
                .setDescription("Caucus to join")
                .setRequired(true)
            )
            .addUserOption(option => option.setName('user').setDescription('User to manage').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("removewhip")
            .setDescription("ADMIN ONLY - Removes a whip from a caucus")
            .addStringOption(option =>
                option.addChoices(
                    { name: "D - Blue Dog", value: "d-bluedog" },
                    { name: "D - New Democrats", value: "d-newdem" },
                    { name: "D - Progressive", value: "d-progressive" },
                    { name: "UCP - Patriot", value: "ucp-patriot" },
                    { name: "UCP - Lincoln", value: "ucp-lincoln" },
                    { name: "UCP - Liberty", value: "ucp-liberty" },
                    { name: "I - Generic", value: "i-generic" },
                )
                .setName("caucus")
                .setDescription("Caucus to join")
                .setRequired(true)
            )
            .addUserOption(option => option.setName('user').setDescription('User to manage').setRequired(true))
        ),
        

        
    execute: async function(interaction: ChatInputCommandInteraction){


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