import { Additional } from "./additional.model"
import { Product } from "./product.model"

export declare class Amount{
    id: number | undefined | null
    product : Product
    quantity: number
    observation: string
    additional: Additional[] | undefined
  amount: any
}