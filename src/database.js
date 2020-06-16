const mongoose = require('mongoose');
uri = 'mongodb://localhost:27017/notes-app';
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => { console.log('DB is connect') })
    .catch(err => console.log(err));
