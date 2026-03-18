import { Types } from "mongoose";

export interface ICollection {
    name: string;
    owner: Types.ObjectId;
    members: Types.ObjectId[]
    itemIds: Types.ObjectId[]
    timestamps: true
}