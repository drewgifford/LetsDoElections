import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { notifyError } from "../../util/response";

const infoCommand = require("./subcommands/info");
const joinCommand = require("./subcommands/join");
const listCommand = require("./subcommands/list");
const dropoutCommand = require("./subcommands/dropout");

export default {

    

    data: new SlashCommandBuilder()
        .setName("race")
        .setDescription("Various commands relating to races")
        .addSubcommand(subcommand => 
            subcommand
                .setName("info")
                .setDescription("Detailed information about a race")
                .addStringOption(option =>
                    option.addChoices(
                        { name: "House of Representatives", value: "house" },
                        { name: "Senate", value: "senate" },
                        { name: "Presidential", value: "president" },
                        { name: "Presidential Primaries", value: "president-primary"}
                    )
                    .setName("race")
                    .setDescription("Race to view")
                    .setRequired(true)
                ),   
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("join")
                .setDescription("Sets your character's race")
                .addStringOption(option =>
                    option.addChoices(
                        { name: "House of Representatives", value: "house" },
                        { name: "Senate", value: "senate" },
                        { name: "Presidential", value: "president" },
                        { name: "Presidential Primaries", value: "president-primary"}
                    )
                .setName("race")
                .setDescription("Race to join")
                .setRequired(true)
            )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("Lists all races")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("dropout")
                .setDescription("Drops out of your current race")
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
            case "dropout":
                return await dropoutCommand.default.execute(interaction);
            default:
                return await notifyError(interaction, "Unknown error. Code 42");


        }
    }


}