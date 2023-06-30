import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User } from "discord.js";
import { DbTable, UuidFields, getRow, listRows } from "../../../db/database";
import { TableCaucus, TableParty, TableUser } from "../../../models/Models";
import { notifyNoCharacter, notifyOtherNoCharacter } from "../../../util/response";
import { choice } from "../../../util/math";
import { EMOJI_CHARACTER } from "../../../util/statics";

let tips = [
    "Edit your character with /character edit",
    "Your faceclaim doesn't have to be human! Go crazy. if you wish!"
]

export default {

    async execute(interaction: CommandInteraction) { 

        let user: User = interaction.options.getUser("user", false) || interaction.user;

        let userText = `<@${user.id}>'s`;

        if (user == interaction.user) userText = "your";


        let userId = user.id;
        
        let dbUser = await getRow(DbTable.Users, UuidFields.Users, userId) as TableUser | null;

        if (dbUser){

            let state = dbUser.State.length > 0 ? dbUser.State[0].value : null;
            let district = dbUser.District

            let location = "*None*";
            if (state && district && district > 0){
                if (district && district > 0){
                    location = `${state}-${district}`
                } else {
                    location = `${state}`
                }   
            }

            let partyString = "None";
            let caucusString = "None";

            if (dbUser.Party.length > 0){
                let party = await getRow(DbTable.Parties, UuidFields.Parties, dbUser.Party[0].value) as TableParty;
                partyString = `${party.Emoji} ${party.Name}`;
            }
            if (dbUser.Caucus.length > 0){
                let caucus = await getRow(DbTable.Caucuses, UuidFields.Caucuses, dbUser.Caucus[0].value) as TableCaucus;
                partyString = `${caucus.Emoji} ${caucus.Name}`;
            }
            

            let bankBalance = (dbUser.BankBalance | 0).toLocaleString("en-US");
            let campaignBalance = (dbUser.CampaignBalance | 0).toLocaleString("en-US");

            console.log(dbUser)

            // Respond with Embed
            let embed = new EmbedBuilder()
                .setTitle(`${EMOJI_CHARACTER} Character Information`)
                .setDescription(
                    `Viewing **${userText}** character:`
                )

                .addFields(
                {
                    name: "Information",
                    value: `📛 **Name:** ${dbUser.Nickname}\n🗺️ **Location:** ${location}`,
                    inline: false
                },
                {
                    name: "Membership",
                    value: `**Party:** ${partyString}\n**Caucus:** ${caucusString}`,
                    inline: true
                },
                {
                    name: "Finances",
                    value: `💰 **Bank**: \`$${bankBalance}\`\n💸 **Campaign**: \`$${campaignBalance}\``,
                    inline: true
                },
                {
                    name: "Description",
                    value: `${dbUser.Description || "*No description set*"}`
                }
                
                
                )


                .setFooter({
                    text: "🛈 Tip: " + choice(tips)
                })

            if (dbUser.Faceclaim){
                embed.setThumbnail(dbUser.Faceclaim);
            }
            
            interaction.reply({embeds: [embed]})

        }
        else {

            if (user.id == interaction.user.id){
                return await notifyNoCharacter(interaction);
            } else {
                return await notifyOtherNoCharacter(interaction, user);
            }

        }
        


    }


}