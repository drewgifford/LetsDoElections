import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, PermissionFlagsBits } from "discord.js";
import { DbTable, UuidFields, getRow, listRows, updateRow } from "../../db/database";
import { TableCaucus, TableChamber, TableUser } from "../../models/Models";
import { notifyNoCharacter, notifyOtherNoCharacter } from "../../util/response";
import { choice } from "../../util/math";
import { EMOJI_FINANCE, EMOJI_SUCCESS } from "../../util/statics";

let tips = [
    "Your campaign balance resets every cycle.",
    "Pay another user with /pay.",
    "Transfer funds from your bank to your campaign using /fund"
]

export default {
    
    data: new SlashCommandBuilder()
        .setName("seats")
        .setDescription("Sets a caucus's seats in a chamber")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option
            .setName("caucus")
            .setDescription("Caucus to modify")
            .setRequired(true)
            .addChoices(
                { name: "D - Blue Dog", value: "d-bluedog" },
                { name: "D - New Democrats", value: "d-newdem" },
                { name: "D - Progressive", value: "d-progressive" },
                { name: "UCP - Patriot", value: "ucp-patriot" },
                { name: "UCP - Lincoln", value: "ucp-lincoln" },
                { name: "UCP - Liberty", value: "ucp-liberty" },
                { name: "I - Generic", value: "i-generic" },
            )
        )
        .addStringOption(option =>
            option
            .setName("chamber")
            .setDescription("Chamber to target")
            .setRequired(true)
            .addChoices(
                { name: "House of Representatives", value: "house" },
                { name: "Senate", value: "senate" },
                { name: "Executive", value: "executive" }
            ))
        .addNumberOption(option =>
            option
            .setName("seats")
            .setDescription("Number of seats")
            .setRequired(true)
            .setMinValue(0)
        ),

        

    async execute(interaction: CommandInteraction) { 

        let caucusId = interaction.options.get("caucus", true).value as string;
        let chamberId = interaction.options.get("chamber", true).value as string;
        let seats = interaction.options.get("seats", true).value as number;

        let caucus = (await getRow(DbTable.Caucuses, UuidFields.Caucuses, caucusId)) as TableCaucus;
        let chamber = (await getRow(DbTable.Chambers, UuidFields.Chambers, chamberId)) as TableChamber;

        
        let caucusSeats: any = {};

        if (caucus.Seats){
            caucusSeats = JSON.parse(caucus.Seats);
        }

        caucusSeats[chamber.Uuid] = seats;


        await updateRow(DbTable.Caucuses, caucus.id, {
            "Seats": JSON.stringify(caucusSeats)
        })

        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_SUCCESS} Changed seat count`)
            .setDescription(`The ${caucus.Emoji} ${caucus.Name} Caucus now has **${seats}** seats in the ${chamber.Emoji} ${chamber.Name}.`);

        await interaction.reply({embeds: [embed]});

    }


}