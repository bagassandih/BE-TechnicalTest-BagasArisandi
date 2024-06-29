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
    const memberPenalized = await borrowModel.count({
      member: member._id,
      status: 'penalized',
      penaltyEndDate: { $gte: todayDate }
    });
    if (memberPenalized) throw new Error('Member is penalized');
    // check max borrow of books from member
    const memberBorrowCount = await borrowModel.count({
      member: member._id,
      status: 'borrowed',
      returnDate: null
    });
    if (memberBorrowCount >= 2 || bookCodes.length > 2 || books.length > 2) throw new Error('Member cannot borrow more than 2 books');
    // check stock of books
    let bookOutofStock = books.filter(book => book.stock < 1).map(book => book.code);
    if (bookOutofStock?.length) {
      const errMsg = bookOutofStock.join(bookOutofStock.length > 1 ? ' and ' : '');
      throw new Error(errMsg + ' is not available');
    }
    // continue to borrow, create data per book
    books.forEach(async (book) => {
      await borrowModel.create({
        member: member._id,
        book: book._id,
        borrowedDate: todayDate,
        status: 'borrowed',
      });
      // update stock of book
      await bookModel.findByIdAndUpdate(book._id,
        { $inc: { stock: -1 } }
      );
    })
    // return with desription status
    return `${member.code} successfully borrowed ${books.length} ${books.length > 1 ? 'books' : 'book'}`;
  }

  async returnBooks(memberCode, bookCodes) {
    if (bookCodes.length > 2) throw new Error('Member cannot return more than 2 books')
    // find available borrow based on member and book
    const borrows = await borrowModel.aggregate([
      {
        $lookup:
        {
          from: 'books',
          localField: 'book',
          foreignField: '_id',
          as: 'bookDetail'
        }
      },
      {
        $lookup:
        {
          from: 'members',
          localField: 'member',
          foreignField: '_id',
          as: 'memberDetail'
        }
      },
      {
        $unwind: '$bookDetail'
      },
      {
        $unwind: '$memberDetail'
      },
      {
        $project: {
          book: 0,
          member: 0
        }
      },
      {
        $match: {
          'memberDetail.code': memberCode,
          'bookDetail.code': { $in: bookCodes },
          'status': 'borrowed'
        }
      }
    ]);
    if (!borrows?.length) throw new Error('Data not found');
    // Process to judge the borrow status by date
    borrows.forEach(async (borrow) => {
      // initiate to update
      const updateObj = { ...borrow };
      const borrowDate = moment(borrow.borrowedDate);
      const rangeDate = moment().diff(borrowDate, 'days');
      // condition to penalty
      if (rangeDate > 7) {
        updateObj.status = 'penalized';
        updateObj.penaltyEndDate = moment().add(3, 'days');
      } else {
        // change the status to returned 
        updateObj.status = 'returned';
      };
      //set returned date to now
      updateObj.returnedDate = moment();
      // update borrow and book data
      await borrowModel.findByIdAndUpdate(borrow._id, updateObj); 
      await bookModel.findByIdAndUpdate(borrow.bookDetail._id, { $inc: { stock: 1 } });
    })
    // return with description status
    return `${memberCode} successfully returned ${borrows.length} ${borrows.length > 1 ? 'books' : 'book'}` + `${borrows.some(borrow => moment().diff(moment(borrow.borrowedDate), 'days') > 7) ? ' with penalty' : ''}`;
  }

  async checkBooks() {
    //  Shows all existing books and quantities & Books that are being borrowed are not counted
    return await bookModel.find({ stock: { $gt: 0 } }).lean();
  }

  async checkMembers() {
    // Aggregate to show all existing members and the number of books being borrowed by each member
    return await memberModel.aggregate([
      {
        $lookup: {
          from: 'borrows',
          localField: '_id',
          foreignField: 'member',
          as: 'borrowedBooks'
        }
      },
      {
        $addFields: {
          booksBorrowed: {
            $size: {
              $filter: {
                input: '$borrowedBooks',
                as: 'borrow',
                cond: { $eq: ['$$borrow.status', 'borrowed'] }
              }
            }
          }
        }
      },
      {
        $project: {
          borrowedBooks: 0 
        }
      }
    ]);
  }
}

module.exports = new LibraryService();