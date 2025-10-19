import mongoose from "mongoose";

const HistorySchema  = new mongoose.Schema({
    userEmail:{
        type:String,
    },
    title:{
        type: String,
        required: false,
        default:""
    },
    history:{
        type: String,
         required: false,
         default:""
    }
},{timestamps:true})

const HistoryModel  = mongoose.model('verista_history', HistorySchema)
export default HistoryModel