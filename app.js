// Require Express et set an instance
const express = require('express');
const app = express();
//--------

// Static files
app.use(express.static('public'));
//--------

// Module to parse sent form data 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//--------

// Module to allow others domains to communicate with this server
const cors = require('cors');
app.use(cors());
//--------

// Module to implement security
const helmet = require('helmet');
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
//---------

// Module to evaluate mathematically a string
const math = require('mathjs');
//---------

// Function to process conversion
const conversion = (n, u) => {

  let initNum = math.evaluate((math.evaluate(n)).toFixed(5)) ;
  let initUnit = u ;
  let returnNum = 0;
  let returnUnit = "";
  let initial_Units = "";
  let return_Units = "";
  let string = "";
  
  switch (initUnit) {
    case 'gal':
      returnNum = math.evaluate((initNum * 3.78541).toFixed(5));
      returnUnit = "L";
      initial_Units = "gallons";
      return_Units = "liters";
      break;
    case 'L':
      returnNum = math.evaluate((initNum / 3.78541).toFixed(5));
      returnUnit = "gal";
      initial_Units = "liters";
      return_Units = "gallons";
      break;
    case 'lbs':
      returnNum = math.evaluate((initNum * 0.453592).toFixed(5));
      returnUnit = "kg";
      initial_Units = "pounds";
      return_Units = "kilograms";
      break;
    case 'kg':
      returnNum = math.evaluate((initNum / 0.453592).toFixed(5));
      returnUnit = "lbs";
      initial_Units = "kilograms"; 
      return_Units = "pounds";
      break;
    case 'mi':
      returnNum = math.evaluate((initNum * 1.60934).toFixed(5));
      returnUnit = "km";
      initial_Units = "miles";
      return_Units = "kilometers";
      break;
    case 'km':
      returnNum = math.evaluate((initNum / 1.60934).toFixed(5));
      returnUnit = "mi";
      initial_Units = "kilometers";
      return_Units = "miles";
      break;
    default:
      break;
  }
  string = `${initNum} ${initial_Units} converts to ${returnNum} ${return_Units}`;
  return {"initNum": initNum, "initUnit": initUnit, "returnNum": returnNum, "returnUnit": returnUnit, "string":string};
}
//---------

// Routes

app.get('/', (req, res) => res.send("/public/index.html"));

app.get('/api/convert', (req, res) => {

  let input = req.query.input.trim();
  let position = input.search(/[gLlkm]/g);

  if (position === -1) res.json({"error":"no unit"});
  else {

    let num = input.slice(0, position) ? input.slice(0, position).trim() : '1';
    let unit = input.slice(position);
    let regex = new RegExp(/(^[\+-]?((\d+\.\d+)|(\d+\.)|(\.\d+)|(\d+)))(\/[\+-]?((\d+\.\d+)|(\d+\.)|(\.\d+)|(\d+)))?$/, 'g');
    let checkNum = regex.test(num);
    let checkUnit = ['gal', 'L', 'lbs', 'kg', 'mi', 'km'].includes(unit);

    if (!checkNum && !checkUnit) res.json({"error": "invalid number and unit"});
    else if (!checkNum) res.json({"error": "invalid number"});
    else if (!checkUnit) res.json({"error": "invalid unit"});
    else res.json(conversion(num, unit));
  }
}); 

app.use((err, req, res, next) => res.status(500).send('Something broke!'));

app.use((req, res, next) => res.status(404).send('Sorry cant find that!'));

app.listen(3000);



