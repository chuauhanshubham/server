const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const City = require('../models/City');

// @route   GET api/cities
// @desc    Get all cities
// @access  Public
router.get('/', async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    res.json(cities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/cities
// @desc    Add new city
// @access  Private (Admin)
router.post(
  '/',
  [
    auth,
    [
      check('name', 'City name is required').not().isEmpty(),
      check('available', 'Available status is required').isBoolean()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, available } = req.body;

    try {
      // Check if user is admin
      if (!req.user.isAdmin) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const newCity = new City({
        name,
        available
      });

      const city = await newCity.save();
      res.json(city);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/cities/:id
// @desc    Update city
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  const { name, available } = req.body;

  // Build city object
  const cityFields = {};
  if (name) cityFields.name = name;
  if (available !== undefined) cityFields.available = available;

  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    let city = await City.findById(req.params.id);

    if (!city) return res.status(404).json({ msg: 'City not found' });

    city = await City.findByIdAndUpdate(
      req.params.id,
      { $set: cityFields },
      { new: true }
    );

    res.json(city);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/cities/:id
// @desc    Delete city
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    let city = await City.findById(req.params.id);

    if (!city) return res.status(404).json({ msg: 'City not found' });

    await City.findByIdAndRemove(req.params.id);

    res.json({ msg: 'City removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;