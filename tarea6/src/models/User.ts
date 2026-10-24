import { Schema, model } from "mongoose";

export interface IUser {
    name: string;
    password: string;
    email: string;
}

const userSchema = new Schema(
{
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
        /^[^\s@]+@iteso\.mx$/,
        "El correo debe tener formato válido y dominio @iteso.mx",
        ],
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
    },
    },
    { timestamps: true }
);

export default model("User", userSchema);
