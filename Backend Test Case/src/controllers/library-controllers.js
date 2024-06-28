const libraryService = require('../services/library-services');

class LibraryController {

  async borrowBooks(req, res) {
    try {
      const { memberCode, bookCodes } = req.body;
      const borrow = await libraryService.borrowBooks(memberCode, bookCodes);
      res.status(200).json(borrow);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async checkBooks(req, res) {
    try {
      const books = await libraryService.checkBooks();
      res.status(200).json(books);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async checkMembers(req, res) {
    try {
      const members = await libraryService.checkMembers();
      res.status(200).json(members);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

};

module.exports = new LibraryController();