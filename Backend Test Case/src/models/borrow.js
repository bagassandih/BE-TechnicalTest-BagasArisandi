const mongoose = require('mongoose');

const BorrowSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowedDate: { type: Date, required: true, default: Date.now },
  returnedDate: { type: Date },
  penaltyEndDate: { type: Date }
});

module.exports = mongoose.model('Borrow', BorrowSchema);
