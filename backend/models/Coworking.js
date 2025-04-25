const mongoose = require("mongoose");

const CoworkingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "Please add a name"],
            unique: true,
            trim: true,
            maxlength: [50, "Name can not be more than 50 characters"],
        },
        address: {
            type: String,
            require: [true, "Please add an address"],
        },
        district: {
            type: String,
            require: [true, "Please add a district"],
        },
        province: {
            type: String,
            require: [true, "Please add a province"],
        },
        postalcode: {
            type: String,
            require: [true, "Please add a postalcode"],
            maxlength: [5, "Postal Code can not be more than 5 digits"],
        },
        tel: {
            type: String,
        },
        region: {
            type: String,
            require: [true, "Please add a region"],
        },
        open_hour: {
            type: String,
            require: [true, "Please add a opening hours"],
        },
        close_hour: {
            type: String,
            require: [true, "Please add a opening hours"],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

CoworkingSchema.virtual("reservations", {
    ref: "Reservation",
    localField: "_id",
    foreignField: "coworking",
    justOne: false,
});

module.exports = mongoose.model("Coworking", CoworkingSchema);
