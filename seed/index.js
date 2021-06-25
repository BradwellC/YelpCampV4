const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Cities = require('./cities');
const { places, descriptors } = require('./seedHelper');


// Database connection
mongoose.connect('mongodb+srv://Admin:N3wC4stl3@cluster0.ppq1v.mongodb.net/WDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(result => {
    console.log('Connected to Database!')
})
.catch(err => {
    console.log(err);
});

const sample = arrary => arrary[Math.floor(Math.random() * arrary.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 400; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '60142c9f339b283e2fb65bb3',
            location: `${Cities[random1000].city}, ${Cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    Cities[random1000].longitude,
                    Cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/chrisbradwell12/image/upload/v1612908982/yelpcamp_images/image1.jpg',
                    filename: 'image1'
                },
                {
                    url: 'https://res.cloudinary.com/chrisbradwell12/image/upload/v1612908983/yelpcamp_images/image3.jpg',
                    filename: 'image3'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quam asperiores doloribus alias nemo cum quidem. Facere est eveniet at!',
            price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});