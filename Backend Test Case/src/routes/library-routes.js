const express = require('express');
const router = express.Router();

router.post('/borrow', (req, res) => res.send('Initiate'));
router.post('/return', (req, res) => res.send('Initiate'));

// Book Check
router.get('/books', (req, res) => res.send('Initiate'));

// Member check
router.get('/members', (req, res) => res.send('Initiate'));

module.exports = router;
