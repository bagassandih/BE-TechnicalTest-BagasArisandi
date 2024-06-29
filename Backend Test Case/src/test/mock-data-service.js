const mockedBooks =
[
  {
    "_id": "667e44b5ef411c751c892723",
    "code": "NRN-7",
    "title": "The Lion, the Witch and the Wardrobe",
    "author": "C.S. Lewis",
    "stock": 1
  },
  {
    "_id": "667e44b5ef411c751c892722",
    "code": "HOB-83",
    "title": "The Hobbit, or There and Back Again",
    "author": "J.R.R. Tolkien",
    "stock": 1
  },
  {
    "_id": "667e44b5ef411c751c892721",
    "code": "TW-11",
    "title": "Twilight",
    "author": "Stephenie Meyer",
    "stock": 1
  },
  {
    "_id": "667e44b5ef411c751c892720",
    "code": "SHR-1",
    "title": "A Study in Scarlet",
    "author": "Arthur Conan Doyle",
    "stock": 0
  },
  {
    "_id": "667e44b4ef411c751c89271f",
    "code": "JK-45",
    "title": "Harry Potter",
    "author": "J.K Rowling",
    "stock": 0
  }
];

const mockedMembers =
[
  {
    "_id": "667e4514ef411c751c892726",
    "code": "M003",
    "name": "Putri"
  },
  {
    "_id": "667e4514ef411c751c892725",
    "code": "M002",
    "name": "Ferry"
  },
  {
    "_id": "667e4514ef411c751c892724",
    "code": "M001",
    "name": "Angga"
  }
];

const mockedBorrows =
[
  {
    'member': '667e4514ef411c751c892724',
    'book': '667e44b5ef411c751c892720',
    'borrowedDate': '2024-06-29T11:52:42.054+05:30',
    'returnedDate' : null,
    'penaltyEndDate' : null,
    'status': 'borrowed',
  },
  {
    'member': '667e4514ef411c751c892724',
    'book': '667e44b4ef411c751c89271f',
    'borrowedDate': '2024-06-29T11:52:15.347+05:30',
    'returnedDate' : null,
    'penaltyEndDate' : null,
    'status': 'borrowed',
  }
]

module.exports = { mockedBooks, mockedMembers, mockedBorrows };