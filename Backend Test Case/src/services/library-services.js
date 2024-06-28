const bookModel = require('../models/book');
const memberModel = require('../models/member');
const borrowModel = require('../models/borrow');
const moment = require('moment');

class LibraryService {

  async borrowBooks(memberCode, bookCodes) {
    // set today date
    const todayDate = moment();
    // find available books and member
    const books = await bookModel.find({ code: { $in: bookCodes } }).lean();
    const member = await memberModel.findOne({ code: memberCode }).lean();
    if (!books?.length) throw new Error('Books not found');
    if (!member) throw new Error('Member not found');
    // check member is penalized or not
    const memberPenalized = await borrowModel.find({
      member: member._id,
      penaltyEndDate: { $lte: todayDate }
    }).lean();
    if (memberPenalized?.length) throw new Error('Member is penalized');
    // check max borrow of books from member
    const memberBorrowCount = await borrowModel.find({
      member: member._id,
      status: 'borrowed',
      returnDate: null
    }).lean();
    if (memberBorrowCount?.length >= 2) throw new Error('Member cannot borrow more than 2 books');
    // check stock of books
    let bookOutofStock = books.filter(book => book.stock < 1).map(book => book.code);
    if (bookOutofStock?.length) {
      const errMsg = bookOutofStock.join(bookOutofStock.length > 1 ? ' and ' : '');
      throw new Error(errMsg + ' is not available');
    }
    // continue to borrow, create data per book
    books.forEach(async (book) => {
      await new borrowModel({
        member: member._id,
        book: book._id,
        borrowedDate: todayDate,
        status: 'borrowed',
      }).save();
      // update stock of book
      await bookModel.findByIdAndUpdate(book._id,
        { $inc: { stock: -1 } }
      );
    })

    return `${member.code} successfuly borrow ${books.length} ${books.length > 1 ? 'books' : 'book'}`;
  }

  async checkBooks() {
    //  Shows all existing books and quantities & Books that are being borrowed are not counted
    return await bookModel.find({ stock: { $gt: 0 } }).lean();
  }


  async checkMembers() {
    // Shows all existing members & The number of books being borrowed by each member
    const members = await memberModel.find().lean();
    return Promise.all(members.map(async (member) => {
      const getBorrowData = await borrowModel.find({ member: member._id, status: 'borrowed' }).lean();
      return {
        ...member,
        booksBorrowed: getBorrowData.length
      }
    }));
  }
}

module.exports = new LibraryService();