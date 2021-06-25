const mongoose =require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;


// https://res.cloudinary.com/chrisbradwell12/image/upload/v1612909942/yelpcamp_images/zjq4qwack2hhyhbztbbg.jpg

const ImgSchema = new Schema({
    url: String,
    filename: String
});

ImgSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImgSchema],
    price: Number,
    description: String,
    location: String,
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
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

CampgroundSchema.post('findByIdAndDelete', async function(doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            },
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);