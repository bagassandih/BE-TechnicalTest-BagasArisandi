// libraryController.test.js
const LibraryController = require('../controllers/library-controllers');
const libraryService = require('../services/library-services');

jest.mock('../services/library-services'); // Mock libraryService

describe('LibraryController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('LibraryController - borrowBooks', () => {
    it('Should return 200 and borrow details when borrowing books successfully', async () => {
      req.body = { memberCode: 'M001', bookCodes: ['HOB-83', 'TW-11'] };
      const borrowDetails = { message: 'M001 successfully borrowed 2 books' };
      libraryService.borrowBooks.mockResolvedValue(borrowDetails);

      await LibraryController.borrowBooks(req, res);

      expect(libraryService.borrowBooks).toHaveBeenCalledWith('M001', ['HOB-83', 'TW-11']);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(borrowDetails);
    });

    it('Should return 400 and error message when libraryService throws an error', async () => {
      req.body = { memberCode: 'M001', bookCodes: ['HOB-83', 'TW-11'] };
      const errorMessage = 'Books not available';
      libraryService.borrowBooks.mockRejectedValue(new Error(errorMessage));

      await LibraryController.borrowBooks(req, res);

      expect(libraryService.borrowBooks).toHaveBeenCalledWith('M001', ['HOB-83', 'TW-11']);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('LibraryController - returnBooks', () => {
    it('Should return 200 and return details when returning books successfully', async () => {
      req.body = { memberCode: 'M001', bookCodes: ['HOB-83', 'TW-11'] };
      const returnDetails = { message: 'M001 successfully returned 2 books' };
      libraryService.returnBooks.mockResolvedValue(returnDetails);

      await LibraryController.returnBooks(req, res);

      expect(libraryService.returnBooks).toHaveBeenCalledWith('M001', ['HOB-83', 'TW-11']);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(returnDetails);
    });

    it('Should return 400 and error message when libraryService throws an error', async () => {
      req.body = { memberCode: 'M001', bookCodes: ['HOB-83', 'TW-11'] };
      const errorMessage = 'Books not found';
      libraryService.returnBooks.mockRejectedValue(new Error(errorMessage));

      await LibraryController.returnBooks(req, res);

      expect(libraryService.returnBooks).toHaveBeenCalledWith('M001', ['HOB-83', 'TW-11']);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('LibraryController - checkBooks', () => {
    it('Should return 200 and books list', async () => {
      const books = [{ code: 'B001', title: 'Book 1' }, { code: 'B002', title: 'Book 2' }];
      libraryService.checkBooks.mockResolvedValue(books);

      await LibraryController.checkBooks(req, res);

      expect(libraryService.checkBooks).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(books);
    });

    it('Should return 400 and error message when libraryService throws an error', async () => {
      const errorMessage = 'Cannot fetch books';
      libraryService.checkBooks.mockRejectedValue(new Error(errorMessage));

      await LibraryController.checkBooks(req, res);

      expect(libraryService.checkBooks).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('LibraryController - checkMembers', () => {
    it('Should return 200 and members list', async () => {
      const members = [{ code: 'M001', name: 'Member 1' }, { code: 'M002', name: 'Member 2' }];
      libraryService.checkMembers.mockResolvedValue(members);

      await LibraryController.checkMembers(req, res);

      expect(libraryService.checkMembers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(members);
    });

    it('Should return 400 and error message when libraryService throws an error', async () => {
      const errorMessage = 'Cannot fetch members';
      libraryService.checkMembers.mockRejectedValue(new Error(errorMessage));

      await LibraryController.checkMembers(req, res);

      expect(libraryService.checkMembers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
