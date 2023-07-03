import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { notifyError } from "../../util/response";

const submitCommand = require("./subcommands/submit");
const viewCommand = require("./subcommands/view");
const addmanagerCommand = require("./subcommands/addmanager");
const removemanagerCommand = require("./subcommands/removemanager");
const infoCommand = require("./subcommands/info");

export default {

    data: new SlashCommandBuilder()
        .setName("docket")
        .setDescription("Management of the Bill Docket")
        .addSubcommand(subcommand => 
            subcommand
                .setName("submit")
                .setDescription("Submit a bill to the docket")
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("view")
                .setDescription("Views all bills in a docket")
                .addStringOption(option =>
                    option
                    .setName("docket")
                    .setDescription("Docket to view")
                    .setRequired(true)
                    .addChoices(
                        {name: "All Dockets", value: "all"},
                        {name: "House", value: "house"},
                        {name: "Senate", value: "senate"},
                        {name: "Executive", value: "executive"},
                        {name: "Law", value: "law"}
                    )
                )
                .addStringOption(option =>
                    option
                    .setName("status")
                    .setDescription("Bill status")
                    .setRequired(false)
                    .addChoices(
                        {name: "Not Introduced", value: "Not Introduced"},
                        {name: "Passed First", value: "Passed First"},
                        {name: "Passed Second", value: "Passed Second"},
                        {name: "Vetoed", value: "Vetoed"},
                        {name: "Veto Overridden", value: "Veto Overridden"},
                        {name: "Signed", value: "Signed"},
                        {name: "Tabled", value: "Tabled"}
                ))
                .addStringOption(option =>
                    option
                    .setName("party")
                    .setDescription("Authored by party")
                    .setRequired(false)
                    .addChoices(
                        { name: "Democratic", value: "D" },
                        { name: "Liberty Coalition", value: "L" },
                        { name: "Christian Democratic Union", value: "C" },
                        { name: "Independent", value: "I" }
                    )
                )
                .addStringOption(option =>
                    option
                    .setName("caucus")
                    .setDescription("Authored by caucus")
                    .setRequired(false)
                    .addChoices(
                        { name: "D - Blue Dog", value: "d-bluedog" },
                        { name: "D - New Democrats", value: "d-newdem" },
                        { name: "D - Progressive", value: "d-progressive" },
                        { name: "I - Right-Wing", value: "i-right" },
                        { name: "I - Centrist", value: "i-center"},
                        { name: "I - Left-Wing", value: "i-left"}
                    )
                )
                .addUserOption(option =>
                    option
                    .setName("user")
                    .setDescription("Authored by user")
                    .setRequired(false)
                )
                .addBooleanOption(option =>
                    option
                    .setName("show_description")
                    .setDescription("Show description of bills")
                    .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("info")
            .setDescription("View information about a docket")
            .addStringOption(option =>
                option.addChoices(
                    {name: "House", value: "house"},
                    {name: "Senate", value: "senate"},
                    {name: "Executive", value: "executive"},
                    {name: "Law", value: "law"}
                )
                .setName("docket")
                .setDescription("Docket to view")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("addmanager")
            .setDescription("ADMIN ONLY - Adds a manager to a docket")
            .addStringOption(option =>
                option.addChoices(
                    {name: "House", value: "house"},
                    {name: "Senate", value: "senate"},
                    {name: "Executive", value: "executive"},
                    {name: "Law", value: "law"}
                )
                .setName("docket")
                .setDescription("Docket to modify")
                .setRequired(true)
            )
            .addUserOption(option => option.setName('user').setDescription('User to manage').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("removemanager")
            .setDescription("ADMIN ONLY - Removes a manager from a docket")
            .addStringOption(option =>
                option.addChoices(
                    {name: "House", value: "house"},
                    {name: "Senate", value: "senate"},
                    {name: "Executive", value: "executive"},
                    {name: "Law", value: "law"}
                )
                .setName("docket")
                .setDescription("Docket to modify")
                .setRequired(true)
            )
            .addUserOption(option => option.setName('user').setDescription('User to manage').setRequired(true))
        )
        ,
        
        
    execute: async function(interaction: ChatInputCommandInteraction){

        console.log(interaction.options.getSubcommand());

        switch(interaction.options.getSubcommand()){
            case "submit":
                return await submitCommand.default.execute(interaction);
            case "view":
                return await viewCommand.default.execute(interaction);
            case "info":
                return await infoCommand.default.execute(interaction);
            case "addmanager":
                return await addmanagerCommand.default.execute(interaction);
            case "removemanager":
                return await removemanagerCommand.default.execute(interaction);
            default:
                return await notifyError(interaction, "Unknown error. Code 42");


        }
    }


}