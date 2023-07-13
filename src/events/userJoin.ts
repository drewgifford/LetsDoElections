import { GuildMember, GuildMemberResolvable } from "discord.js";
import { IDiscordClient } from "../client"
import { getSetting } from "../db/database"

export default { 
    name: "guildMemberAdd",
    async execute(
        member: GuildMember & {
            client: IDiscordClient
        }
    ) {

        let gatekeeperRoleId = await getSetting("GatekeeperRole");
        let verifyChannelId = await getSetting("VerifyChannel");

        if(!gatekeeperRoleId) return;

        await member.roles.add(gatekeeperRoleId);

        if(!verifyChannelId) return;

        let verifyMessageChannel = await member.guild.channels.fetch(verifyChannelId);

        if(!verifyMessageChannel || !verifyMessageChannel.isTextBased()) return;


        let m = await verifyMessageChannel.send(`<@${member.user.id}>`);
        await m.delete();
        
    }


}