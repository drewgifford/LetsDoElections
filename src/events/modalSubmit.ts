import { EmbedBuilder, Interaction } from "discord.js"
import { IDiscordClient } from "../client"
import { DbTable, UuidFields, createRow, getRow, updateRow } from "../db/database";
import { TableUser } from "../models/Models";

export default { 
    name: "interactionCreate",
    async execute(
        interaction: Interaction & {
            client: IDiscordClient
        }
    ) {

        if(!interaction.isModalSubmit()) return;

        let modalId = interaction.customId;
        // Get modal type

        let dbUser = await getRow(DbTable.Users, UuidFields.Users, interaction.user.id) as TableUser | null;


        if(modalId == "editCharacter"){

            let name: string = interaction.fields.getTextInputValue("name");
            let faceclaim: string | null = interaction.fields.getTextInputValue("faceclaim");
            let description: string | null = interaction.fields.getTextInputValue("description");

            if (faceclaim == "") faceclaim = null;
            if (description == "") description = null;
    

            let data = {
                "Uuid": interaction.user.id,
                "Nickname": name,
                "Faceclaim": faceclaim,
                "Description": description
            }

            var response: boolean

            if(!dbUser){

                // CREATE USER
                response = await createRow(DbTable.Users, data);


            } else {
                response = await updateRow(DbTable.Users, dbUser.id, data);
            }

            if(!response){
                return await interaction.reply("An error occurred");
            }

            dbUser = await getRow(DbTable.Users, UuidFields.Users, interaction.user.id) as TableUser

            let embed = new EmbedBuilder()
                .setAuthor({
                    name: "Updated Character",
                    iconURL: "https://em-content.zobj.net/thumbs/160/apple/237/bust-in-silhouette_1f464.png"
                })
                .setDescription(
                    `<@${interaction.user.id}>, your character has been updated!`
                )

                .addFields(
                {
                    name: "Information",
                    value: `📛 **Name:** ${dbUser.Nickname}`,
                    inline: false
                },
                {
                    name: "Description",
                    value: `${dbUser.Description || "*No description set*"}`
                }
                
                
                )


                .setFooter({
                    text: "🛈 Tip: If your faceclaim doesn't appear, you provided an invalid image URL."
                }
            )

            if (dbUser.Faceclaim){
                embed.setThumbnail(dbUser.Faceclaim);
            }


            interaction.reply({embeds: [embed]});
        }

        



    }


}