const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Order = new Schema({
    time: {
        type: Schema.Types.Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    products: [{
        product: { type: Object, ref: 'Products', required: true },
        quantity: { type: Number, required: true }
    }],
    user: {
        email: {
            type: String,
            required: true
        },

        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
});



module.exports = mongoose.model('Order', Order);