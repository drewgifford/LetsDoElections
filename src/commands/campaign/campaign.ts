import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../db/database";
import { TableRace, TableState, TableUser } from "../../models/Models";
import { notifyError, notifyNoCharacter, notifyOtherNoCharacter } from "../../util/response";
import { choice } from "../../util/math";
import { EMOJI_FINANCE } from "../../util/statics";

const runCommand = require("./subcommands/run")
const viewCommand = require("./subcommands/view")

export default {
    
    data: new SlashCommandBuilder()
        .setName("campaign")
        .setDescription("Events pertaining to campaigns")

        .addSubcommand(subcommand => 
            subcommand
            .setName("run")
            .setDescription("Runs a campaign event")
            .addStringOption(option => option
                .setName("type")
                .setDescription("The type of campaign event to run.")
                .setRequired(true)
                .addChoices(
                    { name: "Advertisement", value: "Advertisement" },
                    { name: "Event", value: "Event"}
                )
            )
            .addStringOption(option =>
                option
                .setName("state1")
                .setDescription("First state to run event in")
                .setAutocomplete(true)
                .setRequired(true)
            )
            .addStringOption(option =>
                option
                .setName("state2")
                .setDescription("Second state to run event in")
                .setAutocomplete(true)
                .setRequired(false)
            )
            .addStringOption(option =>
                option
                .setName("state3")
                .setDescription("Third state to run event in")
                .setAutocomplete(true)
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("view")
                .setDescription("Views all campaign events by a user")
                .addUserOption(option =>
                    option
                    .setName("user")
                    .setDescription("User to search")
                    .setRequired(false)
                )
                .addStringOption(option =>
                    option
                    .setName("type")
                    .setDescription("Event type")
                    .setRequired(false)
                    .addChoices(
                        {name: "Advertisement", value: "Advertisement"},
                        {name: "Event", value: "Event"},
                ))
                .addStringOption(option =>
                    option
                    .setName("race")
                    .setDescription("Race")
                    .setRequired(false)
                    .addChoices(
                        {name: "House of Representatives", value: "house"},
                        {name: "Senate", value: "senate"},
                        {name: "Presidential", value: "president"},
                        { name: "Presidential Primaries", value: "president-primary"}
                ))
                .addStringOption(option =>
                    option
                    .setName("state")
                    .setDescription("State to view")
                    .setRequired(false)
                    .setAutocomplete(true)
                )
        ),

        

    autocomplete: async function(interaction: AutocompleteInteraction){

        let choices = ((await listRows(DbTable.States)) as TableState[]).map(state => [state.Uuid, state.Name])


        const focusedValue = interaction.options.getFocused().toLowerCase();
        const filtered = choices.filter(choice => (choice[1].toLowerCase().startsWith(focusedValue) || choice[0].toLowerCase().startsWith(focusedValue))).slice(0, 25);

        await interaction.respond(
            filtered.map(choice => ({name: choice[1], value: choice[0]}))
        );

    },


    async execute(interaction: ChatInputCommandInteraction) { 

        switch(interaction.options.getSubcommand()){
            case "run":
                return await runCommand.default.execute(interaction);
            case "view":
                return await viewCommand.default.execute(interaction);
            default:
                return await notifyError(interaction, "Unknown error. Code 42");


        }



    }


}