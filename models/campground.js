const mongoose = require("mongoose");
const Review = require('./review');
const User = require('./user');
const Schema = mongoose.Schema;

//https://res.cloudinary.com/dqhz7aw8s/image/upload/w_360,h_240/v1611327097/YelpCamp/oxcavnwawkvcxb6ctm2i.jpg

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_130')
})

//mongoose does not include virtual properties when converting the data to JSON and passing it to the client side
//so we need to pass the below option into the schema
const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts)

//we will use this virtual property to render popup link on the cluster map
campgroundSchema.virtual('properties.popupMarkup').get(function () {
    return `
        <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <p>${this.description.substring(0,25)}....</p>`
})

//mongoose middleware to delete all associated reviews when deleting a campground
campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);
module.exports = Campground;
