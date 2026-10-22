import { Schema } from "mongoose";
import { schema, model} from mongoose;

export interface IUser {
    name: string,
    pwd: string,
    email: string
}

const userSchema = new Schema({
    
})