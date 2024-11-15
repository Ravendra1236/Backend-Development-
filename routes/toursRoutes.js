const express = require("express")
const router = express.Router()
const tourController = require("./../controllers/toursController")

// 3. Routes 
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

router.param("id" , tourController.checkID)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody , tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router