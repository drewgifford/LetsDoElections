import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User, ChatInputCommandInteraction } from "discord.js";
import { DbTable, UuidFields, createRow, getRow, getValue, listRows, setValue } from "../../../db/database";
import { TableState, TableUser } from "../../../models/Models";
import { choice } from "../../../util/math";
import { notifyError } from "../../../util/response";
import { EMOJI_STATE } from "../../../util/statics";

export type Result = {

    id: string;
    users: ResultUser[]
    totalVotes: number;

}

export type ResultUser = {
    npc: boolean,
    caucus: string,
    id: string,
    percent: number,
}

export default {

    async execute(interaction: ChatInputCommandInteraction) {

        try {

        let id = interaction.options.getString("id", true);
        let votes = interaction.options.getNumber("votes", true);

        console.log(interaction.options.getString("json", true));

        let json = JSON.parse(interaction.options.getString("json", true)) as Result;

        json.id = id;
        json.totalVotes = votes;

        json.users.sort((a,b) => {
            if(a.percent > b.percent) return -1;
            return 1;
        });

        for(var user of json.users){

            let parts = user.id.split(" ");
            user.npc = false;

            if(parts[0].includes("-")){

                let subParts = parts[0].toLowerCase().split("-");

                if(subParts[0] == "npc"){
                    user.npc = true;

                    user.caucus = subParts[1];

                    if(user.caucus == "cdu") user.caucus = "cdu-generic";
                    if(user.caucus == "lc") user.caucus = "lc-generic";

                    user.id = user.id.replace(parts[0], "").trim();
                }

            }

            if(!user.npc){

                let userDb = await getRow(DbTable.Users, UuidFields.Users, user.id) as TableUser | null;

                if(!userDb) throw `User ${user.id} does not exist.`;
                if(!userDb.Caucus || userDb.Caucus.length == 0){
                    throw `User ${user.id} does not have a caucus.`;
                }

                user.caucus = userDb.Caucus[0];

            }

            console.log(user);


        }

        if (await getValue(DbTable.ModelResults, UuidFields.ModelResults, json.id)) throw `Result ${json.id} already exists`;


        let client = interaction.client;

        await createRow(DbTable.ModelResults, {
            Uuid: json.id,
            Value: JSON.stringify(json)
        });

        
        
        } catch(e){
            return await notifyError(interaction, e as any);
        }
    }


}


/*
{
    "users": [

        {
            "id": "409109985763786753",
            "percent": 49.9
        },
        {
            "id": "npc-cdu glup shitto",
            "percent": 51.1
        }


    ] 
}
*/

if(!String.prototype.trim) {  
    String.prototype.trim = function () {  
      return this.replace(/^\s+|\s+$/g,'');  
    };  
  } 