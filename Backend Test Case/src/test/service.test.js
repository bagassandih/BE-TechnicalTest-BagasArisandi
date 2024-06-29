// import the related stuff
const mockData = require('./mock-data-service');
const bookModel = require('../models/book');
const borrowModel = require('../models/borrow');
const memberModel = require('../models/member');
const moment = require('moment');
const LibraryService = require('../services/library-services');

// describe the test
describe('Library Service - checkBooks()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    // Mock functions or modules related to checkbooks
    bookModel.find = jest.fn(() => {
      return { lean: jest.fn().mockResolvedValue(mockData.mockedBooks.filter(book => book.stock > 0)) }
    })
  });

  // test case
  it('Should return all existing books and quantities with more than 0', async () => {
    // call the service checkBooks
    const getBooks = await LibraryService.checkBooks();
    // expect sections
    expect(bookModel.find).toHaveBeenCalledWith({ stock: { $gt: 0 } });
    getBooks.forEach(book => {
      expect(book.stock).toBeDefined();
      expect(book.stock).toBeGreaterThan(0);
    })
  });
});

describe('Library Service - checkMembers()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    // Mock functions or modules related to check members
    memberModel.aggregate = jest.fn().mockResolvedValue(mockData.mockedMembers.map(member => {
      return {
        ...member,
        booksBorrowed: mockData.mockedBorrows.filter(borrow => borrow.member === member._id && borrow.status === 'borrowed').length
      }
    }))
  });

  it('Should return all members with number of books being borrowed', async () => {
    // call the service checkmembers
    const getMembers = await LibraryService.checkMembers();
    // expect sections
    expect(memberModel.aggregate).toHaveBeenCalled();
    getMembers.forEach(member => {
      // only 1 member that borrowed books based on borrow data
      if (member._id === '667e4514ef411c751c892724') {
        expect(member.booksBorrowed).toBeGreaterThan(0);
      } else {
        expect(member.booksBorrowed).toBe(0);
      };
      expect(member.booksBorrowed).toBeDefined();
    })
  });
});

describe('Library Service - borrowBooks()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('Should borrow books successfully', async () => {
    // mock sections
    bookModel.find = jest.fn(() => {
      return {
        lean: jest.fn().mockResolvedValue(mockData.mockedBooks.filter(book => book.stock > 0).slice(0, 2))
      }
    });
    memberModel.findOne = jest.fn(() => {
      return {
        lean: jest.fn().mockResolvedValue(mockData.mockedMembers[2])
      }
    });
    borrowModel.count = jest.fn().mockResolvedValue(0);
    borrowModel.count = jest.fn().mockResolvedValue(0);
    borrowModel.create = jest.fn().mockResolvedValue({});
    bookModel.findByIdAndUpdate = jest.fn().mockResolvedValue({});
    // initiate sections
    const bookCodes = ['HOB-83', 'TW-11'];
    const memberCode = 'M001';
    const borrowBooks = await LibraryService.borrowBooks(memberCode, bookCodes);
    // expect sections
    expect(bookModel.find).toHaveBeenCalledWith({ code: { $in: bookCodes } });
    expect(memberModel.findOne).toHaveBeenCalledWith({ code: memberCode });
    expect(borrowModel.count).toHaveBeenCalledTimes(2);
    expect(borrowModel.create).toHaveBeenCalled();
    expect(bookModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(borrowBooks).toBe('M001 successfully borrowed 2 books');
  });

  it('Should throw error when books are not found', async () => {
    bookModel.find = jest.fn(() => {
      return {
        lean: jest.fn().mockResolvedValue([])
      }
    });
    memberModel.findOne = jest.fn(() => {
      return {
        lean: jest.fn().mockResolvedValue(mockData.mockedMembers[2])
      }
    });
    const bookCodes = ['AMD-21'];
    const memberCode = 'M001';
    let error;
    try {
      await LibraryService.borrowBooks(memberCode, bookCodes);
    } catch (errorMsg) {
      error = errorMsg
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Books not found');
  });

  it('Should throw error when member is not found', async () => {
    bookModel.find = jest.fn(() => {
      return {
        lean: jest.fn().mockResolvedValue(mockData.mockedBooks)
      }
    });
    memberModel.findOne = jest.fn(() => {
      return {
        lean: jest.fn().mockResolvedValue(undefined)
      }
    });
    const bookCodes = ['HOB-83', 'TW-11', 'NRN-7'];
    const memberCode = 'M001';
    let error;
    try {
      await LibraryService.borrowBooks(memberCode, bookCodes);
    } catch (errorMsg) {
      error = errorMsg
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Member not found');
  });

  it('Should throw error when member is penalized', async () => {
    bookModel.find = jest.fn(() => {
      return {
        lean: jest.fn().mockResolvedValue(mockData.mockedBooks)
      }
    });
    memberModel.findOne = jest.fn(() => {
      return {
        lean: jest.fn().mockResolvedValue(mockData.mockedMembers[2])
      }
    });
    borrowModel.count = jest.fn().mockImplementation(async (query) => {
      return query.status === 'penalized' ? 1 : 0;
    });
    const bookCodes = ['TW-11'];
    const memberCode = 'M001';
    let error;
    try {
      await LibraryService.borrowBooks(memberCode, bookCodes);
    } catch (errorMsg) {
      error = errorMsg
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Member is penalized');
  });

  it('Should throw error when member exceeds max borrow limit', async () => {
    bookModel.find = jest.fn(() => {
      return {
        lean: jest.fn().mockResolvedValue(mockData.mockedBooks.filter(book => book.stock < 1))
      }
    });
    memberModel.findOne = jest.fn(() => {
      return {
        lean: jest.fn().mockResolvedValue(mockData.mockedMembers[2])
      }
    });
    borrowModel.count = jest.fn().mockImplementation(async (query) => {
      return query.status === 'borrowed' ? 2 : 0;
    });
    const bookCodes = ['TW-11'];
    const memberCode = 'M001';
    let error;
    try {
      await LibraryService.borrowBooks(memberCode, bookCodes);
    } catch (errorMsg) {
      error = errorMsg
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Member cannot borrow more than 2 books');
  });

  it('Should throw error when book is out of stock', async () => {
    bookModel.find = jest.fn(() => {
      return {
        lean: jest.fn().mockResolvedValue(mockData.mockedBooks.filter(book => book.stock < 1))
      }
    });
    memberModel.findOne = jest.fn(() => {
      return {
        lean: jest.fn().mockResolvedValue(mockData.mockedMembers[2])
      }
    });
    borrowModel.count = jest.fn().mockResolvedValue(0);
    const bookCodes = ['SHR-1', 'JK-45'];
    const memberCode = 'M001';
    let error;
    try {
      await LibraryService.borrowBooks(memberCode, bookCodes);
    } catch (errorMsg) {
      error = errorMsg
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('SHR-1 and JK-45 is not available');
  });
});

describe('Library Service - returnBooks()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('Should return success message for returning books without penalty', async () => {
    // mock sections
    borrowModel.aggregate = jest.fn().mockResolvedValue(mockData.mockedBorrows.map(borrow => ({
      ...borrow,
      bookDetail: mockData.mockedBooks.filter(book => book._id === borrow.book)
    })));
    borrowModel.findByIdAndUpdate = jest.fn().mockResolvedValue({});
    bookModel.findByIdAndUpdate = jest.fn().mockResolvedValue({});
    // initiate sections
    const bookCodes = ['HOB-83', 'TW-11'];
    const memberCode = 'M001';
    const returnBooks = await LibraryService.returnBooks(memberCode, bookCodes);
    // expect sections
    expect(borrowModel.aggregate).toHaveBeenCalled();
    expect(bookModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(borrowModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(returnBooks).toBe('M001 successfully returned 2 books');
  });

  it('Should return success message for returning books with penalty', async () => {
    // mock sections
    borrowModel.aggregate = jest.fn().mockResolvedValue(mockData.mockedBorrows.map(borrow => ({
      ...borrow,
      bookDetail: mockData.mockedBooks.filter(book => book._id === borrow.book)
    })).map(borrow => ({
      ...borrow,
      borrowedDate: moment(borrow.borrowedDate).subtract(10, 'days')
    }))
    );
    borrowModel.findByIdAndUpdate = jest.fn().mockResolvedValue({});
    bookModel.findByIdAndUpdate = jest.fn().mockResolvedValue({});
    // initiate sections
    const bookCodes = ['HOB-83', 'TW-11'];
    const memberCode = 'M001';
    const returnBooks = await LibraryService.returnBooks(memberCode, bookCodes);
    // expect sections
    expect(borrowModel.aggregate).toHaveBeenCalled();
    expect(bookModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(borrowModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(returnBooks).toBe('M001 successfully returned 2 books with penalty');
  });

  it('Should throw error when member return more than 2 books', async () => {
    borrowModel.aggregate = jest.fn().mockResolvedValue([]);
    const bookCodes = ['HOB-83', 'TW-11', 'KJ-21'];
    const memberCode = 'M001';
    let error;
    try {
      await LibraryService.returnBooks(memberCode, bookCodes);
    } catch (errorMsg) {
      error = errorMsg
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Member cannot return more than 2 books');
  });

  it('Should throw error when no borrowed books found', async () => {
    borrowModel.aggregate = jest.fn().mockResolvedValue([]);
    const bookCodes = ['HOB-83', 'TW-11'];
    const memberCode = 'M001';
    let error;
    try {
      await LibraryService.returnBooks(memberCode, bookCodes);
    } catch (errorMsg) {
      error = errorMsg
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Data not found');
  });
});