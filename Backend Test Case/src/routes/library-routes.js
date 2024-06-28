const express = require('express');
const router = express.Router();

const LibraryController = require('../controllers/library-controllers');

router.post('/borrow', LibraryController.borrowBooks);
router.post('/return', (req, res) => res.send('Initiate'));

// Book Check
router.get('/books', LibraryController.checkBooks);

// Member check
router.get('/members', LibraryController.checkMembers);

module.exports = router;
