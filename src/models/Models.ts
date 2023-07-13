import { ApplicationCommandOption, ApplicationCommandOptionData, ChatInputCommandInteraction, CommandInteraction, InteractionResponse, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js"
import { getAllFiles } from "../util/files"
import { join } from "path"

export interface TableRow {
    id: number,
    Uuid: string
}

export interface TableSetting extends TableRow {
    Value: string,
}

export interface TableUser extends TableRow {

    Nickname: string,
    District: number,
    Description: string,
    Faceclaim: string,
    Party: any[],
    State: any[],
    Caucus: any[]
    Race: any[],
    Bills: any[],
    Chamber: any[]

    CampaignBalance: number,
    BankBalance: number,

    WhipCaucus: any[],
    WhipParty: any[]

}

export interface TableRace extends TableRow {
    Name: string,
    Emoji: string,
    Members: number,
    Role: string,
    Locked: boolean,
    Description: string,
    States: any[],
    Active: boolean,
    Channel: string,
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
    FundManagers: any[],
    Balance: number,
    UserBalance: number,
    Dues: number,
    Seats: string,
    Whips: any[],
    Color: string,
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
    FundManagers: any[],
    Balance: number,
    CaucusBalance: number,
    UserBalance: number,
    Dues: number,
    Whips: any[],
}

export interface TableState extends TableRow {

    Name: string,
    Districts: number,
    Locked: boolean,
    Users: any[]

}

export interface TableChamber extends TableRow {
    Name: string,
    Emoji: string,
    Users: any[],
    Docket: any[],
    Members: number,
    Description: string,
    Managers: any[],
    Role: string,
}

export interface TableDocket extends TableRow {
    Name: string,
    Emoji: string,
    BillPrefix: string,
    Bills: any[],
    Managers: any[],
    Locked: boolean,
    Channel: string,
}

export interface TableBill extends TableRow {
    Name: string,
    Url: string,
    Author: any[],
    Created: string,
    Edited: string,
    Chamber: any[],
    Party: any[],
    Caucus: any[],
    Docket: any[],
    Status: any,
    Cosponsors: any[],
    Description: string,
    History: string,
}

export interface TableEvent extends TableRow {
    Title: string,
    User: any[],
    EventType: string,
    Description: string,
    Race: any[],
    Url: string,
    MessageUrl: string,
    States: any[],
    Created: any,

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
76
        this.slashCommand = slashCommand;
        this.subCommands = subCommands || [];
        this.execute = execute;

    }

}
