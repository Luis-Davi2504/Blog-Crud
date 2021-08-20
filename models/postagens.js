const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const postagens = new Schema({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    content: {
        type: String,
        
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categorias',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
}) 

mongoose.model("Postagens", postagens)