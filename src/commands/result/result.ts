import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { notifyError } from "../../util/response";

const createCommand = require("./subcommands/create");

export default {

    

    data: new SlashCommandBuilder()
        .setName("result")
        .setDescription("Manage model results")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => 
            subcommand
                .setName("create")
                .setDescription("Detailed information about a race")
                .addStringOption(option =>
                    option
                    .setName("id")
                    .setDescription("Result id")
                    .setRequired(true)
                )
                .addNumberOption(option => 
                    option
                    .setName("votes")
                    .setDescription("Total votes cast")
                    .setRequired(true)
                )
                .addStringOption(option => 
                    option
                    .setName("json")
                    .setDescription("Output JSON")
                    .setRequired(true)
                ),   
        ),
        
    execute: async function(interaction: ChatInputCommandInteraction){

        console.log(interaction.options.getSubcommand());

        switch(interaction.options.getSubcommand()){
            case "create":
                return await createCommand.default.execute(interaction);
            default:
                return await notifyError(interaction, "Unknown error. Code 42");


        }
    }


}