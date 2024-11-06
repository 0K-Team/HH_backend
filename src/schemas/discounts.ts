import { Schema, model } from "mongoose";

const schema = new Schema({
    discountCode: String,
    description: String,
    validUntil: Date,
    partnerBrand: String,
    productRestrictions: String,
    termsAndConditions: String,
    url: String
})

export default model("discount", schema);