const express = require('express');
const router = express.Router();

const LibraryController = require('../controllers/library-controllers');
router.post('/borrow', LibraryController.borrowBooks);
router.post('/return', LibraryController.returnBooks);
router.get('/books', LibraryController.checkBooks);
router.get('/members', LibraryController.checkMembers);
router.get('/*', (req, res) => res.status(404).send('Page Not Found.'));

module.exports = router;
