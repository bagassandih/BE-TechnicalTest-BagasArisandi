const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes/library-routes');

const app = express();

app.use(express.json());
app.use('/api', routes);

mongoose.connect('mongodb://127.0.0.1:27017/library')
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });
