import { Schema, model, Types } from "mongoose";

export const STATUSES = ["found", "returned"] as const;
export type ItemStatus = (typeof STATUSES)[number];

export interface ILostItem {
    title: string;
    description: string;
    location: string;
    foundDate: Date;
    status: ItemStatus;
    user: Types.ObjectId;
}

const lostItemSchema = new Schema(
    {
    title: {
        type: String,
        required: [true, "El título es obligatorio"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "La descripción es obligatoria"],
        trim: true,
    },
    location: {
        type: String,
        required: [true, "La ubicación es obligatoria"],
        trim: true,
    },
    foundDate: {
        type: Date,
        required: [true, "La fecha del hallazgo es obligatoria"],
        validate: {
        validator: (v: Date) => v.getTime() <= Date.now(),
        message: "La fecha del hallazgo no puede ser futura",
        },
    },
    status: {
        type: String,
        enum: { values: STATUSES, message: "Estado inválido (found | returned)" },
        default: "found",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    },
    { timestamps: true }
);

export default model("LostItem", lostItemSchema);