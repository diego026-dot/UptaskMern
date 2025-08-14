import mongoose, {Schema, Document,Types} from 'mongoose'
import { ITask } from './Task'

export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    createdAd: Date
}

const TokenSchema : Schema = new Schema({
    token: {
        type: String,
        required: true,
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    createdAd
    : {
        type: Date,
        required: true,
        default: Date.now(),
        expires: '10m'
    },
    
})
const Token = mongoose.model<IToken>('Token', TokenSchema)
export default Token