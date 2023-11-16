import { ActionRowBuilder, CommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { notifyError, notifyNoCharacter } from "../../../util/response";
import { TableUser, TableRace } from "../../../models/Models";

export default {
    async execute(interaction: CommandInteraction) { 

        let user = (await getRow(DbTable.Users, UuidFields.Users, interaction.user.id)) as TableUser | null;

        if (!user){
            return await notifyNoCharacter(interaction);
        }

        if (user.Race.length == 0){
            return await notifyError(interaction, "You are not running in a race.");
        }

        let race = (await getRow(DbTable.Races, UuidFields.Races, user.Race[0].value)) as TableRace;

        if (!race.Active){
            return await notifyError(interaction, `Campaigning is currently closed for the ${race.Emoji} ${race.Name} race.`);
        }

        let eventType = interaction.options.get("type", true).value as string;

        let stateIds = (await listRows(DbTable.States)).map(s => s.Uuid);

        let errorStates: string[] = [];
        let states: string[] = [];
        ["state1", "state2", "state3"].forEach(s => {

            let state = interaction.options.get(s, false)?.value as string | null;

            if(!state) return;

            if(!stateIds.includes(state)){
                errorStates.push(state);
                return;
            }

            states.push(state);

        });

        if (errorStates.length > 0){
            return await notifyError(interaction, `The following states do not exist: ${errorStates.join(', ')}`);
        }

        if(states.length == 0){
            return await notifyError(interaction, `You must run this campaign in at least one state. Use the options \`state1\`, \`state2\`, and \`state3\` to do so.`);
        }

        let tokens = user.Tokens;
        if(states.length > tokens){
            return await notifyError(interaction, `You need :coin: **${states.length} tokens** to run that event in those states. You have :coin: **${tokens} tokens.** Run \`/collecttokens\` to collect your daily token allowance.`);
        }


        let modal = new ModalBuilder()
            .setCustomId(`runCampaign|${eventType}|${states.join(',')}`)
            .setTitle(`Campaign ${eventType}`);


        let nameInput = new TextInputBuilder()
            .setCustomId("title")
            .setLabel("Headline/Title")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        let descriptionInput = new TextInputBuilder()
            .setCustomId("description")
            .setLabel("Content")
            .setMaxLength(3500)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)

        let faceclaimInput = new TextInputBuilder()
            .setCustomId("url")
            .setLabel("Media URL")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)

        let firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
        let secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(faceclaimInput);
        let thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        return await interaction.showModal(modal);


    }
}