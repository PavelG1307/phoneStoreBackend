import { Product } from "./product.model"

export type UUID = string
export type Option = {
    id: number,
    name?: string,
    values: string
    type?: string
}

export type Variant = {
    id: number,
    isDefault?: boolean,
    optionIds: number[]
    optionInfo: Partial<Product>
  }