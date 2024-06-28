const bookModel = require('../models/book');

class LibraryService {
  
  async checkBooks() {
    //  Shows all existing books and quantities & Books that are being borrowed are not counted
    return await bookModel.find({ stock: { $gt: 0 } }).lean();
  }
}

module.exports = new LibraryService();