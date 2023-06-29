import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import { notifyError } from "../../util/response";
import { DbTable, listRows } from "../../db/database";
import { TableState } from "../../models/Models";

const joinCommand = require("./subcommands/join");
const listCommand = require("./subcommands/list");
const infoCommand = require("./subcommands/info");

export default {

    data: new SlashCommandBuilder()
        .setName("state")
        .setDescription("Various commands relating to states")

        .addSubcommand(subcommand =>
            subcommand
                .setName("info")
                .setDescription("Detailed information about a state")
                .addStringOption(option =>
                    option.setName("state")
                    .setDescription("State to view")
                    .setRequired(true)
                    .setAutocomplete(true)
            )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("join")
                .setDescription("Sets your character's state")
                .addStringOption(option =>
                    option.setName("state")
                    .setDescription("State to join")
                    .setRequired(true)
                    .setAutocomplete(true)
            )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("Lists all active states")
        ),

    autocomplete: async function(interaction: AutocompleteInteraction){

        let choices = ((await listRows(DbTable.States)) as TableState[]).map(state => [state.Uuid, state.Name])


        const focusedValue = interaction.options.getFocused().toLowerCase();
        const filtered = choices.filter(choice => (choice[1].toLowerCase().startsWith(focusedValue) || choice[0].toLowerCase().startsWith(focusedValue))).slice(0, 25);

        await interaction.respond(
            filtered.map(choice => ({name: choice[1], value: choice[0]}))
        );

    },
        
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