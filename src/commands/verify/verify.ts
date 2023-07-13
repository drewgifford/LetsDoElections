import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction, AutocompleteInteraction, PermissionFlagsBits } from "discord.js";
import { notifyError } from "../../util/response";
import { DbTable, listRows } from "../../db/database";
import { TableBill, TableState } from "../../models/Models";

const acceptCommand = require("./subcommands/accept");
const failCommand = require("./subcommands/fail");

export default {

    
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("User Verification")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName("accept")
                .setDescription("Verifies a user")
                .addUserOption(option =>
                    option
                    .setName("user")
                    .setDescription("User to verify")
                    .setRequired(true)
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("fail")
                .setDescription("Fails a user's verification")
                .addUserOption(option =>
                    option
                    .setName("user")
                    .setDescription("User to fail verification")
                    .setRequired(true)
                )
        ),
        
    execute: async function(interaction: ChatInputCommandInteraction){

        console.log(interaction.options.getSubcommand());

        switch(interaction.options.getSubcommand()){
            case "accept":
                return await acceptCommand.default.execute(interaction);
            case "fail":
                return await failCommand.default.execute(interaction);
            default:
                return await notifyError(interaction, "Unknown error. Code 42");


        }
    }


}