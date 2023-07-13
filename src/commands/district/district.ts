import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import { notifyError } from "../../util/response";
import { DbTable, listRows } from "../../db/database";

const joinCommand = require("./subcommands/join");

export default {
    
    data: new SlashCommandBuilder()
        .setName("district")
        .setDescription("Various commands relating to districts")

        .addSubcommand(subcommand =>
            subcommand
                .setName("join")
                .setDescription("Sets your character's district")
                .setDescription("District to join")
                .addIntegerOption(option =>
                    option.setName("district")
                    .setDescription("District to join")
                    .setMinValue(1)
                    .setRequired(true)
            )
        ),
        
    execute: async function(interaction: ChatInputCommandInteraction){

        console.log(interaction.options.getSubcommand());

        switch(interaction.options.getSubcommand()){
            case "join":
                return await joinCommand.default.execute(interaction);
            default:
                return await notifyError(interaction, "Unknown error. Code 42");


        }
    }


}