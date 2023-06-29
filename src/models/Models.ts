import { ApplicationCommandOption, ApplicationCommandOptionData, ChatInputCommandInteraction, CommandInteraction, InteractionResponse, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js"
import { getAllFiles } from "../util/files"
import { join } from "path"

export interface TableRow {
    id: number,
    Uuid: string
}

export interface TableUser extends TableRow {

    Nickname: string,
    District: number,
    Description: string,
    Faceclaim: string,
    Party: any[],
    State: any[],
    Caucus: any[]
    Race: any[]

    CampaignBalance: number,
    BankBalance: number,

}

export interface TableRace extends TableRow {
    Name: string,
    Emoji: string,
    Members: number,
    Role: string,
    Locked: boolean,
    Description: string,
    States: any[],
    Users: any[]
}

export interface TableCaucus extends TableRow {
    Name: string,
    Members: number,
    Emoji: string,
    Role: string,
    Description: string,
    Locked: boolean,
    Party: any[],
    Users: any[],
    Balance: number,
    UserBalance: number,
}

export interface TableParty extends TableRow {

    Name: string,
    Members: number,
    FormalId: string,
    Emoji: string,
    Role: string,
    ShortDesc: string,
    LongDesc: string,
    Locked: boolean,
    Users: any[],
    Caucuses: any[],
    Balance: number,
    CaucusBalance: number,
    UserBalance: number,
}

export interface TableState extends TableRow {

    Name: string,
    Districts: number,
    Locked: boolean,
    Users: any[]

}

type CommandExecution = (interaction: CommandInteraction) => any

export class SubCommand {

    name: string;
    execute: CommandExecution;

    constructor(name: string, execute: CommandExecution){
        this.name = name;
        this.execute = execute;
    }

}

export class Command {

    subCommands: SubCommand[];
    slashCommand: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
    execute: CommandExecution;

    constructor(slashCommand: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder, execute: CommandExecution, subCommands?: SubCommand[]){

        this.slashCommand = slashCommand;
        this.subCommands = subCommands || [];
        this.execute = execute;

    }

}
