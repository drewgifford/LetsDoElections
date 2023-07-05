import { ApplicationCommandOptionBase, ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {

    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Rolls a die")
        .addNumberOption(option =>
            option.setName("sides")
            .setDescription("Number of sides")
            .setMinValue(1)
            .setRequired(true)
        )

        .addNumberOption(option =>
            option.setName("center")
            .setDescription("Weighted center of the roll")
            .setMinValue(1)
            .setRequired(false)
        )

        .addNumberOption(option =>
            option.setName("add")
            .setDescription("Number to add at the end of the roll")
            .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction){


        let sides: number = interaction.options.getNumber("sides", true);

        let center: number | null = interaction.options.getNumber("center", false);
        let add: number | null = interaction.options.getNumber("add", false);

        function gaussianRandom(mean=0, stdev=1) {
            let u = 1 - Math.random(); // Converting [0,1) to (0,1]
            let v = Math.random();
            let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
            // Transform to the desired mean and standard deviation:
            return z * stdev + mean;
        }

        if (!add) add = 0;

        if (!center) center = null;


        var description = `d${sides}`
        if (add > 0) {
            description = description + `+${add}`;
        }

        if (center){
            description += `, center = ${center}`;
        }


        function getRoll(){
            if (center) {

                var standard_deviation = sides / 2;

                return Math.max(1, Math.min(sides, Math.round((gaussianRandom(center, standard_deviation)/sides) * (sides - 1)) + 1 + (add || 0)));
            }
            else {
                return Math.round(Math.random() * (sides - 1)) + 1 + (add || 0);
            }
        }


        let embed = new EmbedBuilder();

        embed
                .setTitle(`Dice Roll :game_die:`)
                .setDescription(`Roll: **${getRoll()}** (${description})`)


        return interaction.reply({embeds: [embed]})

    }
}