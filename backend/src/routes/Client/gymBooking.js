const express = require("express");
const router = express.Router();
const requireAuth = require('../../middleware/requireAuth');
const gymBookingControl = require("../../controller/Client/gymBookingController");


router.post('/:gymId/bookGym', gymBookingControl.makeBookingGym);
router.get('/count/:profileId', requireAuth, gymBookingControl.getBookingCount);
router.get('/bookingDetails/:profileId', requireAuth, gymBookingControl.getAllBookings);
router.put('/cancel/:id', requireAuth, gymBookingControl.cancelBooking);
router.delete('/delete/:id', requireAuth, gymBookingControl.deleteBooking);






module.exports = router;