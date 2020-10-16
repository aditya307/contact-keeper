const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { validationResult, check } = require('express-validator');
const Contact = require('../models/Contact');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      success: false,
      err: 'Server Error',
    });
  }
});

router.post(
  '/',
  [auth, [check('name', 'Please enter the name').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });
      const contact = await newContact.save();
      console.log(contact);
      return res.status(200).json({
        success: true,
        data: contact,
      });
    } catch (err) {
      console.log(err);
      return res.status(404).json({
        success: false,
        err: 'Server Error',
      });
    }
  }
);

router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ msg: 'Not authorized' });
    }
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );
    res.status(200).json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(401).json({ msg: 'Contact not found' });
    }

    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not Authorised' });
    }

    await Contact.findByIdAndRemove(req.params.id);
    return res.status(200).json({ msg: 'Contact Rem0ved' });
  } catch (err) {
    console.log(err);
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
