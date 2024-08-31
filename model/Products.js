const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    title: { type: String, required: true ,unique:true},
    description: { type: String, required: true },
    price: { type: Number },
    discountPercentage: { type: Number },
    rating: { type: Number },
    stock: { type: Number },
    tags: [{ type: String }], 
    brand: { type: String },
    sku: { type: String },
    category: { type: String },
    weight: { type: Number },
    dimensions: {
        width: { type: Number }, 
        height: { type: Number },
        depth: { type: Number }
    },
    warrantyInformation: { type: String },
    shippingInformation: { type: String },
    availabilityStatus: { type: String },
    reviews: [
        {
            rating: { type: Number }, 
            comment: { type: String },
            date: { type: Date },
            reviewerName: { type: String },
            reviewerEmail: { type: String }
        }
    ],
    returnPolicy: { type: String },
    minimumOrderQuantity: { type: Number },
    meta: {
        createdAt: { type: Date },
        updatedAt: { type: Date },
        barcode: { type: String },
        qrCode: { type: String }
    },
    images: [{ type: String }],
    thumbnail: { type: String }
});


const virtual = productSchema.virtual('id')
virtual.get(function(){
    return this._id;
})
productSchema.set('toJSON',{
    virtuals :true,
    versionKey : false,
    transform : function (doc , ret){ delete ret._id}
})


exports.Product = mongoose.model('Product', productSchema);
