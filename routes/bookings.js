const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Booking = require('../models/Booking');

// @route   POST api/bookings
// @desc    Create a booking
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('tripType', 'Trip type is required').not().isEmpty(),
      check('fromCity', 'From city is required').not().isEmpty(),
      check('toCity', 'To city is required').not().isEmpty(),
      check('departureDate', 'Departure date is required').not().isEmpty(),
      check('pickupTime', 'Pickup time is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      tripType,
      fromCity,
      toCity,
      departureDate,
      returnDate,
      pickupTime
    } = req.body;

    try {
      const newBooking = new Booking({
        userId: req.user.id,
        tripType,
        fromCity,
        toCity,
        departureDate,
        returnDate,
        pickupTime
      });

      const booking = await newBooking.save();
      res.json(booking);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/bookings
// @desc    Get all bookings for user (or all for admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let bookings;
    if (req.user.isAdmin) {
      bookings = await Booking.find().sort({ createdAt: -1 }).populate('userId', 'email');
    } else {
      bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;