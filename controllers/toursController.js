const AppError = require('../utils/appError');
const Tour = require('./../models/tourModal');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
// fs module : return data in form of string

// param middleware
// exports.checkID = (req , res , next , val)=>{
//   const id = req.params.id * 1;
//    if (id > tours.length - 1) {
//      return res.status(404).json({
//        status: 'fail',
//        message: 'Invalid input',
//      });
//    }
//    next() ;
// }

// exports.checkBody = (req , res , next)=>{
//   if(!req.body.name || !req.body.price){
//     return res.status(400).json({
//       status : "failed",
//       message : "Name or Price is incorrect."
//     })
//   }
//   next() ;
// }

// exports.getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: Tour.length,
//     data: {
//       tours: Tour,
//     },
//   });
// };

exports.aliasTopTours = (req, res, next) => {
  (req.query.limit = '5'),
    (req.query.sort = '-ratingAverage,price'),
    (req.query.fields = 'name,price,ratingAverage,summary');
  next();
};
exports.getAllTours = catchAsync(async (req, res) => {
  // console.log(req.query);
  // const tours = await Tour.find({
  //   difficulty: 'easy',
  //   duration: 5,
  // });

  // But in queries we can give sort , page . fields , limit

  // Build Query :
  // 1. Filtering:
  // const queryObj = { ...req.query };
  // const excludeFields = ['sort', 'fields', 'page', 'limit'];
  // excludeFields.forEach((el) => delete queryObj[el]);
  // // console.log(req.query, queryObj);
  // let query = Tour.find(queryObj);

  // Advance filtering :
  // let queryStr = JSON.stringify(queryObj) ;
  // queryStr = queryStr.replace(/\b(gte/gt/lte/lt)\b/g , match => `$${match}`) ;
  // console.log(JSON.parse(query));
  // let query = Tour.find(JSON.parse(queryStr)) ;

  // 2. Sorting :
  // if (req.query.sort) {
  // // sorting based on price and other things also.
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   // console.log(sortBy);
  //     //  sorting based on price
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('createdAt');
  // }

  // 3. Fields limiting :

  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   console.log(fields);
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v'); // We exclude this
  // }

  //4. Pagination :
  // page=2&limit=10 , 1-10 page1, 11-20 page2 , 21-30 page3
  //const query = query.skip(20).limit(10)

  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;

  // query = query.skip(skip).limit(limit);

  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) throw new Error('This page does not exist.');
  // }
  // const tours = await Tour.find(req.query);

  // Execute Query :
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitingFiled();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour1 = await Tour.findById(req.params.id);

  if (!tour1) {
    return next(new AppError('No tour found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour1,
    },
  });
});

// exports.getTour = (req, res) => {
//   const id = req.params.id * 1; // Convert it into number form
//   const tour = Tour.find((el) => el.id === id);

//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid input.',
//     });
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });
// };
// exports.createTour = (req, res) => {
//   // const newId = tours[tours.length - 1].id + 1;
//   // const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);

//   // fs.writeFile(
//   //   `${__dirname}/dev-data/data/tours-simple.json`,
//   //   JSON.stringify(tours),
//   //   (err) => {
//   //     res.status(201).json({
//   //       status: 'success',
//   //       data: {
//   //         tours: newTour,
//   //       },
//   //     });
//   //   }
//   // );
// };

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  
  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });

  // try {
  //   const newTour = await Tour.create(req.body);
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       tour: newTour,
  //     },
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: 'Invalid Data Sent !',
  //   });
  // }
});
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID.', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID.', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: 'ratingsQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match : {_id : {$ne : "EASY"}}
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }, // To create array of names
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0, // Will not show _id
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
