const Tour = require('./../models/tourModal');

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

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);
    // const tours = await Tour.find({
    //   difficulty: 'easy',
    //   duration: 5,
    // });

    // But in queries we can give sort , page . fields , limit

    // Build Query : 
    const queryObj = { ...req.query };
    const excludeFields = ['sort', ' fields', 'page', 'limit'];
    excludeFields.forEach((el) => delete queryObj[el]);
    console.log(req.query, queryObj);

    // const tours = await Tour.find(req.query);
    const query = Tour.find(queryObj);
    

    // Execute Query : 
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      message: 'Something went wrong.',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour1 = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour1,
      },
    });
  } catch (err) {
    res.status(404).json({
      message: 'Something went wrong.',
    });
  }
};

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
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid Data Sent !',
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: 'failed',
      message: 'Something worng happened!',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(401).json({
      status: 'failed',
      message: 'Something worng happened!',
    });
  }
};
