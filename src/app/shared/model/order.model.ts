import { Amount } from "./amount.model";

export declare interface Order {
    id: number | undefined | null
    dateCreation: string 
    name: string 
    cellPhone: string ,
    amounts: Amount[] | undefined
    payment: string 
    address: string 
    status: string | undefined,
    numPrint?: number | undefined
}