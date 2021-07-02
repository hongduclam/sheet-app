const express = require('express');
const path = require('path');


const multer = require('multer')
var storage = multer.diskStorage(
  {
    destination: './public/uploads/',
    filename: function ( req, file, cb ) {
      cb( null, req.body.name);
    }
  }
);
// const upload = multer({dest: './public/uploads/'})
const upload = multer({storage})



const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
app.post('/upload', upload.single('file'), function (req, res) {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any
  console.log(req.file, req.body);
  res.json({message: "Successfully uploaded files", data: req.body});
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
