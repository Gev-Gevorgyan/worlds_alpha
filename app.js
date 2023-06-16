const express = require('express');
const { connectToDb, getDb } = require('./mongodb');
const fs = require('fs');
const readline = require('readline');
const { normal } = require('./norm');
const { test } = require('./test');


const app = express();
app.use(express.json());
app.use(express.text());

const port = 5555;


let db;

connectToDb((err) => {
  if (!err) {
      app.listen(port, () => {
          console.log(`app listening on port ${port}`);
      });
      db = getDb();
  }
})
  
  app.post('/api/collection', (req, res) => {
    const wordsArray = [];
  
    const readStream = fs.createReadStream('words_alpha.txt');
    const rl = readline.createInterface({
      input: readStream,
      output: process.stdout,
      terminal: false
    });
  
    rl.on('line', (word) => {
      wordsArray.push({ word: word });
    });
  
    rl.on('close', () => {
      db.collection('words')
        .insertMany(wordsArray)
        .then((result) => {
          res.status(201).json(result);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ err: 'Could not create new documents.' });
        });
    });
  });

  app.get('/api/search', (req, res) => {
    let searchWord = req.query.w;
      db.collection('words')
      .findOne({word: `${searchWord}`})
      .then((doc) => {
        if (doc) {
            res.status(201).json({response: `${searchWord} word is found`});
          } else if(!doc){
            res.status(404).json({ error: 'No matching word is found' });
          }
      })
      .catch((err) => {
        res.status(500).json({error: 'Could not fetch the document'})
      })
  })

  app.post('/api/normalize', (req, res) => {
    const word = req.body;
    const resWord = normal(word);
    res.send(`
        Sent word: ${word}
        Normilized word: ${resWord}
    `);
  });

  app.get('/api/test', (req, res) => {
    const words = [
        'Angry', 'Taxes', 'Call', 'Fruits', 'Gun7es',
        'Polies', 'Values','Ladi#%$^&es', 'Worlds',
        'Dogs', 'Wives', 'John', 'Daughters', 'Bodes',
        'Finish', 'Hero#$%&^$es', 'Men', 'Cities'
    ];
    const result = test(words);
    res.send(`
        Words for testing: 
        ${words}
        Results: 
        ${result}
    `);
  });