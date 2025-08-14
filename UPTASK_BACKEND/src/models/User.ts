import mongoose, {Schema, Document, PopulatedDoc, Types} from 'mongoose'
import { ITask } from './Task'

export interface IUser extends Document {
    email: string
    password: string
    name: string
    confirmed: boolean
}

const UserSchema : Schema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model<IUser>('User', UserSchema)
export default User