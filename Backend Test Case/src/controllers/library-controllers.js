const libraryService = require('../services/library-services');

class LibraryController {
  async checkBooks(req, res) {
    try {
      const books = await libraryService.checkBooks();
      res.status(200).json(books);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new LibraryController();