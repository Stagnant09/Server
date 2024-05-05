//Node.js type of server to store sessionIDs and produce new ones
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 1234;

var counter = 0;

var sessionIDs = [];

var responsesPerUser = {
    
}

const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET POST PUT DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length');
    res.header('Access-Control-Allow-Credentials', true);
    //res.header('Access-Control-Allow-Origin', 'http://localhost:1234');
    res.header('Access-Control-Expose-Headers', 'true');

    next();
  });

function generateSessionID() {
    return Math.floor(Math.random()*100);
} 

app.get('/', (req, res) => {
    console.log('Request received : ' + counter);
    counter++;
    var sessionID = generateSessionID();
    while (sessionIDs.includes(sessionID) || sessionID == 0) {
        sessionID = generateSessionID();
    }
    sessionIDs.push(sessionID);
    console.log(sessionIDs);
    res.json({ success: true, sessionID: sessionID });
})

app.post('/results', (req, res) => {
    console.log('Request received');
    console.log(req.body);
    const body = req.body;
    responsesPerUser[body.sessionID] += body.results + ','; // Assuming sessionID is provided in the request body
    res.json({ success: true });
    console.log(responsesPerUser);
});

app.post('/scores', (req, res) => {
    console.log('Request received');
    console.log(req);
    console.log(req.body);
    console.log(req.body.sessionID);
    var respons = responsesPerUser["id="+req.body.sessionID];
    respons = respons.split(',');
    for (var i = 0; i < respons.length; i++) {
        if (respons[i].includes('undefined')) {
            //Cut the word 'undefined' from the string
            respons[i].replace('undefined', '');
        }
        if (respons[i] == "undefined50"){
            respons[i] = '50';
        }
        if (respons[i] == "undefined100"){
            respons[i] = '100';
        }
        if (respons[i] == "undefined0"){
            respons[i] = '0';
        }
        if (respons[i] == "undefined25"){
            respons[i] = '25';
        }
        if (respons[i] == "undefined75"){
            respons[i] = '75';
        }
    }
    
    
    console.log(respons);
    //respons = respons[0];
    var scores = [];
    var economy = 0;
    var law = 0;
    var central = 0;
    var tradition = 0;
    var minority = 0;
    var nation = 0;
    for (var i = 0; i < 23; i++) {
        if (respons[i].includes('undefined')) {
            //Cut the word 'undefined' from the string
            respons[i].replace('undefined', '');
        }
        if (respons[i] != ',') {
            if (i == 4 || i == 5 || i == 8 || i == 10 || i == 11 || i == 13 || i == 14 || i == 16 || i == 18 || i == 22) {
                economy += Number(respons[i]);
            }
            else {
                economy += 100 - Number(respons[i]);
            }
        }
        
    }
    scores.push(economy/23);
    for (var i = 23; i < 38; i++) {
        if (respons[i].includes('undefined')) {
            //Cut the word 'undefined' from the string
            respons[i].replace('undefined', '');
        }
        if (respons[i] != ',') {
            if (i == 23 || i == 27 || i == 29 || i == 30 || i == 33) {
                law += 100 - Number(respons[i]);
            }
            else {
                law += Number(respons[i]);
            }
        }
        
    }
    scores.push(law/15);
    for (var i = 38; i < 48; i++) {
        if (respons[i].includes('undefined')) {
            //Cut the word 'undefined' from the string
            respons[i].replace('undefined', '');
        }
        if (respons[i] != ',') {
            if (i == 38 || i == 39 || i == 43 || i == 45 || i == 46 || i == 47) {
                central += 100 - Number(respons[i]);
            }
            else {
                central += Number(respons[i]);
            }
        }
    }
    scores.push(central/10);
    for (var i = 48; i < 56; i++) {
        if (respons[i].includes('undefined')) {
            //Cut the word 'undefined' from the string
            respons[i].replace('undefined', '');
        }
        if (respons[i] != ',') {
            if (i == 50 || i == 53) {
                tradition += 100 - Number(respons[i]);
            }
            else {
                tradition += Number(respons[i]);
            }
            
        }
    }
    scores.push(tradition/8);
    for (var i = 56; i < 64; i++) {
        if (respons[i].includes('undefined')) {
            //Cut the word 'undefined' from the string
            respons[i].replace('undefined', '');
        }
        if (respons[i] != ',') {
            if (i == 56 || i == 57 || i == 58 || i == 61 || i == 62) {
                minority += 100 - Number(respons[i]);
            }
            else {
                minority += Number(respons[i]);
            }
            
        }
    }
    scores.push(minority/8);
    for (var i = 64; i < 80; i++) {
        if (respons[i].includes('undefined')) {
            //Cut the word 'undefined' from the string
            respons[i].replace('undefined', '');
        }
        if (respons[i] != ',') {
            if (i == 64 || i == 66 || i == 67 || i == 70 || i == 71 || i == 73 || i == 75 || i == 77 || i == 78 || i == 79) {
                nation += 100 - Number(respons[i]);
            }
            else {
                nation += Number(respons[i]);
            }
            
        }
    }
    scores.push(nation/16);
    toBeSent = {
        economy: scores[0],
        law: scores[1],
        central: scores[2],
        tradition: scores[3],
        minority: scores[4],
        nation: scores[5]
    }
    toBeSent = JSON.stringify(toBeSent);
    console.log(scores);
    res.json({ success: true, scores: toBeSent });
    console.log({ success: true, scores: toBeSent });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

