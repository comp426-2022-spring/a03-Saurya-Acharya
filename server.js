const http = require('http')

// Require Express.js
const express = require("express")
const app = express()

const args = require('minimist')(process.argv.slice(2))

args['port']

const port = args.port || process.env.PORT || 5000 

// Start an app server
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
});

app.get("/app/", (req, res) => {
  res.status(200).end("OK");
  res.type("text/plain");
});

app.get('/app/flip', (req, res) => {
  var flip = coinFlip()
  res.status(200).json({
      'flip': flip
  })
})

app.get('/app/flips/:number', (req, res) => {
  var rawFlips = coinFlips(req.params.number)
  var summaryFlips = countFlips(rawFlips)
  res.status(200).json({
      'raw': rawFlips,
      'summary': summaryFlips
  })
});

app.get('/app/flip/call/heads', (req, res) => {
  res.status(200).json(flipACoin('heads'))
})

app.get('/app/flip/call/tails', (req, res) => {
  res.status(200).json(flipACoin('tails'))
})

// Default response for any other request
app.use(function(req, res){
  res.status(404).send('404 NOT FOUND')
});

/*Coin Functions*/

function coinFlip() {
  var x = (Math.round(Math.random()) == 0);
  if(x){
    return "heads";
  }else{
    return "tails";
  }
}

function coinFlips(flips) {
  let flipsList = [];
  for (let i = 0; i< flips; i++){
    flipsList.push(coinFlip())
  }
  return flipsList;
}

function countFlips(array) {
  var count;
  let tails = 0;
  let heads = 0;

  for (let i = 0; i< array.length; i++){
    if (array[i] == "heads"){
      heads+=1;
    }
    else{
      tails+=1;
    }
  }

  if (tails == 0) {
    count = { heads };
  } else if (heads == 0) {
    count = { tails };
  } else {
    count = { tails, heads };
  }

  return count;
}

function flipACoin(call) {
  let aCoinFlip = coinFlip()
  let resulting = {
    call: call,
    flip: aCoinFlip,
    result: ""
  }

  if (resulting.call == aCoinFlip){
    resulting.result = "win";
  }
  else{
    resulting.result = "lose";
  }

  return resulting
}