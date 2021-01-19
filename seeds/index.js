//Seeder file

const mongoose = require("mongoose");
const cities = require('./cities'); //array of random cities
const { descriptors, places } = require('./seedHelpers'); //descriptors and places array to make fake names

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Database Connected"))
.catch((err) => console.log("Couldnt Connect", err));
const Campground = require("../models/campground");

const sample = array => array[Math.floor(Math.random() * array.length)]; //randomly choosing an element of array

const seedDb = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000 + 1); //random no b/w 1 to 1000 to choose city
        const price = Math.floor(Math.random() * 20) + 20;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/600x480/?nature,camp,campground',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorum blanditiis consequuntur ex neque iste tenetur. Velit ab, laudantium distinctio eveniet recusandae, soluta dignissimos praesentium debitis repellat hic veritatis ex corrupti.',
            price,
            author:'6006e58af1ed3f1cfceaeae2'
        });
        await camp.save();
    }    
}

//seedDb deletes all existing campgrounds and creates 50 new campgrounds
seedDb().then(()=>{
    mongoose.connection.close();
})
