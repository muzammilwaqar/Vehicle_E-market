'use strict';

//get libraries
const express = require('express');
var queue = require('express-queue');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');

//create express web-app
const app = express();
const invoke = require('./invokeNetwork');
const query = require('./queryNetwork');
var _time = "T00:00:00Z";

//declare port
var port = process.env.PORT || 8000;
if (process.env.VCAP_APPLICATION) {
  port = process.env.PORT;
}

app.use(bodyParser.json({
  limit: '50mb', 
  extended: true

}));

app.use(bodyParser.urlencoded({
 limit: '50mb', 
 extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });

//Using queue middleware
app.use(queue({ activeLimit: 30, queuedLimit: -1 }));

//run app on port
app.listen(port, function () {
  console.log('app running on port: %d', port);
});

//-------------------------------------------------------------
//----------------------  POST API'S    -----------------------
//-------------------------------------------------------------

app.post('/api/addContract', async function (req, res) {
let a =req.body;
  var request = {
    chaincodeId: 'vehicle',
    fcn: 'addContract',
    args: [

      req.body.contractID,
      req.body.sellerFullName,
      req.body.sellerCNIC,
      req.body.sellerSecretKey,
      req.body.buyerFullName,
      req.body.buyerCNIC,
      req.body.buyerSecretKey,
      req.body.carRegistrationNumber,
      req.body.price,
      req.body.carMake,
      req.body.carModel,
      req.body.registrationCity,
      req.body.engineType,
      req.body.engineCapacity,
      req.body.transmission,
      req.body.color,
      req.body.image


    ]
  };
/*  var object = {};
a.forEach(function(value, key){
    object[key] = value;
});
var json = JSON.stringify(object);*/
console.log(req.body+"  hgkjghjghjhgkjhgerorrrrrrrrrrrr");
  let response = await invoke.invokeCreate(request);
  if (response) {
    if(response.status == 200)
    res.status(response.status).send({ message: "The contract with ID: "+req.body.contractID+ " is stored in the blockchain with " +response.message  });
    else
    res.status(response.status).send({ message: response.message});
  }
});

//-------------------------------------------------------------
//----------------------  GET API'S  --------------------------
//-------------------------------------------------------------

app.get('/api/queryContractBySellerName', async function (req, res) {

  const request = {
    chaincodeId: 'vehicle',
    fcn: 'queryContractBySellerName',
    args: [
      req.query.sellerFullName
    ]
  };
  console.log(req.query);
  let response = await query.invokeQuery(request)
  if (response) {
    if(response.status == 200)
      res.status(response.status).send(JSON.parse(response.message));
    else
      res.status(response.status).send({ message: response.message });
  }
});

app.get('/api/queryContractBySellerCNIC', async function (req, res) {

  const request = {
    chaincodeId: 'vehicle',
    fcn: 'queryContractBySellerCNIC',
    args: [
      req.query.sellerCNIC
    ]
  };
  console.log(req.query);
  let response = await query.invokeQuery(request)
  if (response) {
    if(response.status == 200)
      res.status(response.status).send(JSON.parse(response.message));
    else
      res.status(response.status).send({ message: response.message });
  }
});

app.get('/api/queryContractByBuyerName', async function (req, res) {

  const request = {
    chaincodeId: 'vehicle',
    fcn: 'queryContractByBuyerName',
    args: [
      req.query.buyerFullName
    ]
  };
  console.log(req.query);
  let response = await query.invokeQuery(request)
  if (response) {
    if(response.status == 200)
      res.status(response.status).send(JSON.parse(response.message));
    else
      res.status(response.status).send({ message: response.message });
  }
});

app.get('/api/queryContractByBuyerCNIC', async function (req, res) {

  const request = {
    chaincodeId: 'vehicle',
    fcn: 'queryContractByBuyerCNIC',
    args: [
      req.query.buyerCNIC
        
    ]
  };
  console.log(req.query);
  let response = await query.invokeQuery(request)
  if (response) {
    if(response.status == 200)
      res.status(response.status).send(JSON.parse(response.message));
    else
      res.status(response.status).send({ message: response.message });
  }
});

app.get('/api/queryContractByCarRegistrationNumber', async function (req, res) {

  const request = {
    chaincodeId: 'vehicle',
    fcn: 'queryContractByCarRegistrationNumber',
    args: [
      req.query.carRegistrationNumber
        
    ]
  };
  console.log(req.query);
  let response = await query.invokeQuery(request)
  if (response) {
    if(response.status == 200)
      res.status(response.status).send(JSON.parse(response.message));
    else
      res.status(response.status).send({ message: response.message });
  }
});

app.get('/api/queryAllContracts', async function (req, res) {

  const request = {
    chaincodeId: 'vehicle',
    fcn: 'queryAllContracts',
    args:[]
   
  };
  let response = await query.invokeQuery(request)
  if (response) {
    if(response.status == 200)
    res.status(response.status).send(JSON.parse(response.message));
    else
    res.status(response.status).send({ message: response.message });
  }
});

app.get('/api/queryContractByID', async function (req, res) {

  const request = {
    chaincodeId: 'vehicle',
    fcn: 'queryContractByID',
    args: [
      req.query.contractID
        
    ]
  };
  console.log(req.query);
  let response = await query.invokeQuery(request)
  if (response) {
    if(response.status == 200)
      res.status(response.status).send(JSON.parse(response.message));
    else
      res.status(response.status).send({ message: response.message });
  }
});
