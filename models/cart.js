const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartSchema = new Schema({
    products: {
        items: [{
            productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }]
    },
    price: {
        type: Number,
        required: true
    },
    time: {
        type: Schema.Types.Date,
        required: true
    },
    timeUp: {
        type: Schema.Types.Boolean,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});


module.exports = mongoose.model('Cart', cartSchema);