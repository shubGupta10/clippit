import mongoose, { Schema, Document } from "mongoose";
import { ICollection } from "./controller.interface";

export interface CollectionDocument extends ICollection, Document { }

const CollectionSchema = new Schema<ICollection>(
    {
        name: {
            type: String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        members: {
            type: [Schema.Types.ObjectId],
            default: [],
            ref: "User"
        },
        itemIds: {
            type: [Schema.Types.ObjectId],
            default: [],
            ref: "Item"
        }
    },
    { timestamps: true }
)

CollectionSchema.index({ owner: 1, createdAt: -1 });

const Collection = mongoose.model<ICollection>("Collection", CollectionSchema);

export default Collection;