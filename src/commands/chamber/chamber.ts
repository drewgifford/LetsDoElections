import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { notifyError } from "../../util/response";

const infoCommand = require("./subcommands/info");
const listCommand = require("./subcommands/list");

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
        ),
        
    execute: async function(interaction: ChatInputCommandInteraction){

        console.log(interaction.options.getSubcommand());

        switch(interaction.options.getSubcommand()){
            case "list":
                return await listCommand.default.execute(interaction);
            case "info":
                return await infoCommand.default.execute(interaction);
            default:
                return await notifyError(interaction, "Unknown error. Code 42");


        }
    }


}