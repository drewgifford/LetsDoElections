import { ApplyOptions } from "@sapphire/decorators";
import { Command, CommandOptions, AliasPiece, ApplicationCommandRegistry } from "@sapphire/framework";
import { ChatInputCommandInteraction, SlashCommandUserOption, EmbedBuilder } from "discord.js"


@ApplyOptions<Command.Options>({
    name: "balance",
	description: 'Checks the balance of yourself or another user'
})
export class BalanceCommand extends Command {

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {

        console.log("i am registering")

        registry.registerChatInputCommand((builder) => {

            builder
                .setName("balance")
                .setDescription("test")

                // User option
                .addUserOption(option => 
                    option
                        .setName('user')
                        .setDescription('User to check balance')
                        .setRequired(false)
                );

        }, {
            guildIds: ["813999804933865472"]
        })
    }

    public override chatInputRun(interaction: ChatInputCommandInteraction){

        let user = interaction.options.getUser('user', false);

        if (!user) user = interaction.user;

        let embed = new EmbedBuilder()
            .setAuthor({
                name: 'Finance', iconURL: "https://cdn-icons-png.flaticon.com/512/4021/4021642.png"
            })
            .setTitle("User Balance")
            .setDescription("Hello world!");

        return interaction.reply({


            embeds: [embed]
        })

        
        

    }
}