import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { notifyError } from "../../util/response";

const infoCommand = require("./subcommands/info");
const listCommand = require("./subcommands/list");
const addmanagerCommand = require("./subcommands/addmanager");
const removemanagerCommand = require("./subcommands/removemanager");

export default {
    
    data: new SlashCommandBuilder()
        .setName("chamber")
        .setDescription("Various commands relating to chambers")
        .addSubcommand(subcommand => 
            subcommand
                .setName("info")
                .setDescription("Detailed information about a chamber")
                .addStringOption(option =>
                    option.addChoices(
                        { name: "House of Representatives", value: "house" },
                        { name: "Senate", value: "senate" },
                        { name: "Executive", value: "executive" }
                    )
                    .setName("chamber")
                    .setDescription("Chamber to view")
                    .setRequired(true)
                ),   
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("Lists all chambers")
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("addmanager")
            .setDescription("ADMIN ONLY - Adds a manager to a chamber")
            .addStringOption(option =>
                option.addChoices(
                    { name: "House of Representatives", value: "house" },
                    { name: "Senate", value: "senate" },
                )
                .setName("chamber")
                .setDescription("Chamber to modify")
                .setRequired(true)
            )
            .addUserOption(option => option.setName('user').setDescription('User to manage').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("removemanager")
            .setDescription("ADMIN ONLY - Removes a manager from a chamber")
            .addStringOption(option =>
                option.addChoices(
                    { name: "House of Representatives", value: "house" },
                    { name: "Senate", value: "senate" },
                )
                .setName("chamber")
                .setDescription("Chamber to modify")
                .setRequired(true)
            )
            .addUserOption(option => option.setName('user').setDescription('User to manage').setRequired(true))
        ),
        
    execute: async function(interaction: ChatInputCommandInteraction){


        switch(interaction.options.getSubcommand()){
            case "list":
                return await listCommand.default.execute(interaction);
            case "info":
                return await infoCommand.default.execute(interaction);
            case "addmanager":
                return await addmanagerCommand.default.execute(interaction);
            case "removemanager":
                return await removemanagerCommand.defualt.execute(interaction);
            default:
                return await notifyError(interaction, "Unknown error. Code 42");


        }
    }


}