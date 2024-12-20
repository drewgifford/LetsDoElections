import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { TableState } from "../../../models/Models";
import { choice } from "../../../util/math";
import { notifyError } from "../../../util/response";
import { EMOJI_STATE } from "../../../util/statics";

let tips = [
    "View a list of states using /state list",
    "Join a state using /state join",
]



export default {

    async execute(interaction: ChatInputCommandInteraction) {

        let stateId = interaction.options.get("state", true).value as string;
        
        let state = (await getRow(DbTable.States, UuidFields.States, stateId)) as TableState;

        if(!state){
            return await notifyError(interaction, `The state ${stateId} doesn't exist.`)
        }

        let users: string[] = [];
        state.Users.forEach((u) => {
            users.push("<@"+u.value+">");
        })
        let usersString = users.join(", ");

        let embed = new EmbedBuilder()
            .setTitle(`${EMOJI_STATE} ${state.Name} Information`)
            .setFooter({
                text: "🛈 Tip: " + choice(tips)
            })
            .addFields(
            {
                name: `Residents - ${state.Users.length}`,
                value: `${usersString || "*Nobody is in this state. You could be the first!*"}`
            }
            
            )



        interaction.reply({embeds: [embed]});


    }


}