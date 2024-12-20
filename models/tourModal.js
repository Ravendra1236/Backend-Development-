const mongoose = require('mongoose');
const slugify = require("slugify")
const validator = require("validator")

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // To remove extra spaces
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'Tour name must have less than 40 characters.'],
      minlength: [10, 'Tour name must have more than 10 characters.'],

      // validate : [validator.isAlpha , "Must have characters."]
    },
    slug: String,

    duration: {
      type: Number,
      required: [true, ' A tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, ' A tour must have a group size.'],
    },
    difficulty: {
      type: String,
      required: [true, ' A tour must have a difficulty.'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be easy , medium or hard.'
      },
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Must be above 1'],
      max: [5, 'Must be below 5'],
      required: true,
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // return boolean value
          // this only points to current doc on NEW doucment creation
          return val < this.price;
        },
        message : "Discount price ({PRICE}) must be below regular price."
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, ' A tour must have a summary.'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, ' A tour must have a description.'],
    },
    imageCover: {
      type: String,
      required: [true, ' A tour must have a cover image.'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,  // So that user can not see this by default
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7 ;
})

// // DOCUMENT MIDDLEWARE : runs before .save() and .create()

tourSchema.pre('save' , function(next){
  this.slug = slugify(this.name, {lower : true}
  )
  next();
})

// tourSchema.pre('save', function (next) {
//   console.log('Will Save Document...');
//   next();
// });

// tourSchema.post('save' , function(doc , next){
//   console.log(doc);
//   next();
// })


// QUERY MIDDLEWARE 
tourSchema.pre(/^find/ , function(next){
// tourSchema.pre("find" , function(next){
  this.find({secretTour : { $ne : true}})
  this.start = Date.now();
  next();
})

tourSchema.post(/^find/ , function(docs , next){
  // console.log(`Query Took ${Date.now() - this.start} milliseconds.`);
  // console.log(docs);
  next() ;
})

// //AGGREGATION MIDDLEWARW : 
tourSchema.pre("aggregate" , function(next){
  this.pipeline().unshift({$match : {secretTour : {$ne: true}}})
  console.log(this.pipeline());
  next();
})

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
