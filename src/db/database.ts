import axios from "axios";
import { TableRow, TableUser, TableParty, TableSetting } from "../models/Models";

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
    Events = 177545,
    Settings = 180202,
    ModelResults = 184382
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
    Events = "field_1186125",
    Settings = "field_1206576",
    ModelResults = "field_1237979"
}

export async function listRowsFromString(table: DbTable, string: string){


    console.log("Getting more results");

    let response = await axios({
        method: "GET",
        url: string,
        headers: HEADERS
    })

    if(!response || !("results" in response.data)){
        // We didn't get any data back.
        return [] as TableRow[];
    }

    var results = response.data.results as TableRow[];

    if("next" in response.data && response.data.next != "" && response.data.next != null){

        console.log(response.data.next);

        var newRows = await listRowsFromString(table, response.data.next as string) as TableRow[];

        results = results.concat(newRows);
    }

    return results;

}

export async function listRows(table: DbTable, filter: string = ""){

    if (filter != ""){
        filter = "&" + filter;
    }

    return await listRowsFromString(table, `https://api.baserow.io/api/database/rows/table/${table}/?user_field_names=true&size=200${filter}`);

}

export async function getValue(table: DbTable, uuidField: UuidFields, name: string){

    let row = await getRow(DbTable.Settings, UuidFields.Settings, name) as TableSetting | null;

    if(!row) return null;

    return row.Value;

}
export async function setValue(table: DbTable, uuidField: UuidFields, name: string, value: string){

    let row = await getRow(DbTable.Settings, UuidFields.Settings, name);

    if(!row){

        return await createRow(DbTable.Settings, {
            "Uuid": name,
            "Value": value
        });

    } else {
        return await updateRow(DbTable.Settings, row.id, {
            "Value": value
        })
    }
}

export async function getSetting(name: string){

    return await getValue(DbTable.Settings, UuidFields.Settings, name);
}
export async function setSetting(name: string, value: string){

    return await setValue(DbTable.Settings, UuidFields.Settings, name, value);
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

export async function updateMany(table: DbTable, data: object[]){

    if(data.length == 0) return true;

    let response = await axios({
        method: "PATCH",
        url: `https://api.baserow.io/api/database/rows/table/${table}/batch/?user_field_names=true`,
        headers: HEADERS,
        data: {
            "items": data
        }
    });

    if(response) return true;
    return false;

}