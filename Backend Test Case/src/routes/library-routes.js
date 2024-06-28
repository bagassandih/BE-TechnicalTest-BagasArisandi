const express = require('express');
const router = express.Router();

const LibraryController = require('../controllers/library-controllers');

router.post('/borrow', (req, res) => res.send('Initiate'));
router.post('/return', (req, res) => res.send('Initiate'));

// Book Check
router.get('/books', LibraryController.checkBooks);

// Member check
router.get('/members', (req, res) => res.send('Initiate'));

module.exports = router;
