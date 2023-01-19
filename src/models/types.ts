import { Product } from "./product.model"

export type UUID = string
export type Option = {
    id: number,
    name: string,
    values: {
      id: number,
      name: string
    }
}
export type Variant = {
    id: number,
    names: string[]
    isDefault: boolean,
    optionIds: number[]
    optionInfo: Partial<Product>
  }