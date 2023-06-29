import axios from "axios";
import { TableRow, TableUser, TableParty } from "../models/Models";

require("dotenv").config();

const BASEROW_TOKEN = process.env.BASEROW_TOKEN;

const HEADERS = {
    Authorization: "Token " + BASEROW_TOKEN
}

export enum DbTable {
    Users = 176745,
    Parties = 176748,
    States = 176757,
    Caucuses = 176767
}

export enum UuidFields {
    Users = "field_1179608",
    Parties = "field_1179626",
    States = "field_1179678",
    Caucuses = "field_1179714"
}

export async function listRows(table: DbTable){

    let response = await axios({
        method: "GET",
        url: `https://api.baserow.io/api/database/rows/table/${table}/?user_field_names=true`,
        headers: HEADERS
    })

    if(!response || !("results" in response.data)){
        // We didn't get any data back.
        return [] as TableRow[];
    }

    // We did get some data back
    return response.data.results as TableRow[];
}

export async function getRow(table: DbTable, field: UuidFields, uuid: string){

    let response = await axios({
        method: "GET",
        url: `https://api.baserow.io/api/database/rows/table/${table}/?user_field_names=true&filter__${field}__equal=${uuid}&size=1`,
        headers: HEADERS
    })

    if(!response || !("results" in response.data)){
        // We didn't get any data back.
        return [] as TableRow[];
    }

    // We did get some data back

    if (response.data.results.length == 0){
        return null;
    }

    return response.data.results[0] as TableRow;

}

export async function updateRow(table: DbTable, rowId: number, data: object){

    let response = await axios({
        method: "PATCH",
        url: `https://api.baserow.io/api/database/rows/table/${table}/${rowId}/?user_field_names=true`,
        headers: HEADERS,
        data: data
    });

    if(response) return true;
    return false;

}