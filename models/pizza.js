const mogoose = require('mongoose');
const Schema = mogoose.Schema;


const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true
    }
});


module.exports = mogoose.model('Product', productSchema);