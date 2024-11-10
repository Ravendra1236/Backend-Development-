const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
// fs module : return data in form of string

// REST Architecture :

// 2. Router Handler

// param middleware
exports.checkID = (req , res , next , val)=>{
  const id = req.params.id * 1;
   if (id > tours.length - 1) {
     return res.status(404).json({
       status: 'fail',
       message: 'Invalid input',
     });
   }
   next() ;
}

exports.checkBody = (req , res , next)=>{
  if(!req.body.name || !req.body.price){
    return res.status(400).json({
      status : "failed",
      message : "Name or Price is incorrect."
    })
  }
  next() ;
}

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1; // Convert it into number form
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid input.',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
};
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '<Data is Modified>',
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
