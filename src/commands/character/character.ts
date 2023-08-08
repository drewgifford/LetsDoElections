import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { notifyError } from "../../util/response";

const infoCommand = require("./subcommands/info");
const editCommand = require("./subcommands/edit");

export default {
    
    data: new SlashCommandBuilder()
        .setName("character")
        .setDescription("Various commands relating to caucuses")
        .addSubcommand(subcommand => 
            subcommand
                .setName("info")
                .setDescription("View a user's character")
                .addUserOption(option => option

                    .setName("user")
                    .setDescription("The user to view the character of")
                    .setRequired(false)
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("edit")
                .setDescription("Edits your character")
        ),
        
    execute: async function(interaction: ChatInputCommandInteraction){


        switch(interaction.options.getSubcommand()){
            case "edit":
                return await editCommand.default.execute(interaction);
            case "info":
                return await infoCommand.default.execute(interaction);
            default:
                return await notifyError(interaction, "Unknown error. Code 42");


        }
    }


}