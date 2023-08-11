import { UUID } from "src/models/types";

export interface IPublicPromoCode {
    name: string;
    uuid: UUID;
    discount: number;
}