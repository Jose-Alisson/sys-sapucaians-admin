import { SafeUrl } from "@angular/platform-browser"
import { AdditionalManager } from "./additionalManager.model"

export declare interface Product{
    id: number | undefined | null
    name: string 
    photoUrl?: string,
    photoObject?: SafeUrl
    description: string 
    price: number 
    category: string | undefined | null
    available: boolean | undefined
    visible: boolean | undefined
    additional: AdditionalManager[]
}