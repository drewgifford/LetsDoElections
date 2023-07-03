import axios from "axios";
import { TableRow, TableUser, TableParty } from "../models/Models";

require("dotenv").config();

const BASEROW_TOKEN = process.env.BASEROW_TOKEN;

const HEADERS = {
    Authorization: "Token " + BASEROW_TOKEN,
}

export enum DbTable {
    Users = 176745,
    Parties = 176748,
    States = 176757,
    Caucuses = 176767,
    Races = 176973,
    Bills = 177020,
    Chambers = 177021,
    Dockets = 177023,
    Events = 177545
}

export enum UuidFields {
    Users = "field_1179608",
    Parties = "field_1179626",
    States = "field_1179678",
    Caucuses = "field_1179714",
    Races = "field_1181464",
    Bills = "field_1182357",
    Chambers = "field_1182365",
    Dockets = "field_1182390",
    Events = "field_1186125"
}

export async function listRows(table: DbTable, filter: string = ""){

    if (filter != ""){
        filter = "&" + filter;
    }



    let response = await axios({
        method: "GET",
        url: `https://api.baserow.io/api/database/rows/table/${table}/?user_field_names=true${filter}`,
        headers: HEADERS
    })

    if(!response || !("results" in response.data)){
        // We didn't get any data back.
        return [] as TableRow[];
    }

    // We did get some data back
    return response.data.results as TableRow[];
}

export async function getPage(table: DbTable, amountPerPage: number, filter: string = "", page: number = 1){

    if (filter != ""){
        filter = "&" + filter;
    }

    let response = await axios({
        method: "GET",
        url: `https://api.baserow.io/api/database/rows/table/${table}/?user_field_names=true&size=${amountPerPage}&page=${page}${filter}`,
        headers: HEADERS
    })

    if(!response || !("results" in response.data)){

        return {
            "count": 0,
            "pages": 0,
            "page": 1,
            "results": [] as TableRow[]
        };

    }

    return {
        "count": response.data.count,
        "pages": Math.ceil(response.data.count / amountPerPage),
        "page": page,
        "results": response.data.results
    }

}

export async function getRow(table: DbTable, field: UuidFields, uuid: string){

    let response = await axios({
        method: "GET",
        url: `https://api.baserow.io/api/database/rows/table/${table}/?user_field_names=true&filter__${field}__equal=${uuid}&size=1`,
        headers: HEADERS
    })

    if(!response || !("results" in response.data)){
        // We didn't get any data back.
        return null;
    }

    // We did get some data back

    if (response.data.results.length == 0){
        return null;
    }

    return response.data.results[0] as TableRow;

}

export async function createRow(table: DbTable, data: object){
    let response = await axios({
        method: "POST",
        url: `https://api.baserow.io/api/database/rows/table/${table}/?user_field_names=true`,
        headers: HEADERS,
        data: data
    });

    if(response) return true;
    return false;
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