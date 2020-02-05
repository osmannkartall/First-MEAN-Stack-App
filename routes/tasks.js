var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb+srv://enteryourdbuserId:enteryourdbpassword@ecommercedb-ajrkj.mongodb.net/test?retryWrites=true';

const dbName = 'eCommerceDB';
const cNameAddress = 'Address';

var app = express();

// Get All the Adresses
router.get('/tasks', function(req, res, next){
  mongo.connect(url, function(err, client) {
  if(err){
    assert.equal(null, err);
  }
  else { console.log("Connected successfully to server");}
  const db = client.db(dbName);
  const colAddress = db.collection(cNameAddress);

  var addressesJSON = {
    index: []
  };
  colAddress.find().toArray((err, item) => {
    addressesJSON.index.push({
        "id" : item._id,
        "name" : item.name,
        "surname" : item.surname,
        "address" : {
          "city" : item.city,
          "town" : item.town,
          "district" : item.district,
          "street" : item.street
        },
        "description" : item.description,
        "phoneNumbers" : [
          item.phoneNumbers
        ]
    });
    res.json(item);
  });
  client.close();
  });
  console.log(res.body);
});

// Get Single Address
router.get('/task/:id', function(req, res, next){
  mongo.connect(url, function(err, client) {
    if(err){
      assert.equal(null, err);
    }
    else { console.log("Connected successfully to server");}
    const db = client.db(dbName);
    const colAddress = db.collection(cNameAddress);

    var addrId = require('mongodb').ObjectID(req.params.id);
    colAddress.findOne({_id: addrId}, function(err, address){
      if(err){
          res.send(err);
      }
      res.json(address);
    });
    client.close();
    });
});

// Save New Address
router.post('/task', function(req, res, next){
  var newAddress = req.body;
  // burada parametreleri ekle.
  if( !newAddress.name              ||
      !newAddress.surname           ||
      !newAddress.address.city      ||
      !newAddress.address.town      ||
      !newAddress.address.district  ||
      !newAddress.address.street    ||
      !newAddress.description       ||
      !newAddress.phoneNumbers
    ){
      res.status(400);
      res.json({
          "error": "Bad Data"
      });
  } else {
    mongo.connect(url, function(err, client) {
      const db = client.db(dbName);
      if(err){
        assert.equal(null, err);
      }
      else { console.log("Connected successfully to server");}
      const colAddress = db.collection(cNameAddress);

      colAddress.insertOne(newAddress, function(err, address){
            if(err){
                res.send(err);
            }
            res.json(address.insertedId);
      });
    });
  }
});

// Delete an Address
router.delete('/task/:id', function(req, res, next){
  mongo.connect(url, function(err, client) {
    if(err){
      assert.equal(null, err);
    }
    else { console.log("Connected successfully to server");}
    const db = client.db(dbName);
    const colAddress = db.collection(cNameAddress);

    var addrId = require('mongodb').ObjectID(req.params.id);
    colAddress.remove({_id: addrId}, function(err, address){
      if(err){
          res.send(err);
      }
      res.json(address);
    });
    client.close();
    });
});

// Update an Address
router.put('/task/:id', function(req, res, next){
  mongo.connect(url, function(err, client) {
    if(err){
      assert.equal(null, err);
    }
    else { console.log("Connected successfully to server");}
    const db = client.db(dbName);
    const colAddress = db.collection(cNameAddress);

    var addrId = require('mongodb').ObjectID(req.params.id);

    var reqAddress = req.body;
    var updAddress = {};

    if(reqAddress.name){ updAddress.name = reqAddress.name; }
    if(reqAddress.surname){ updAddress.surname = reqAddress.surname; }
    if(reqAddress.address){ updAddress.address = reqAddress.address; }
    if(reqAddress.description){ updAddress.description = reqAddress.description; }
    if(reqAddress.phoneNumbers){ updAddress.phoneNumbers = reqAddress.phoneNumbers; }

    if(!updAddress){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
      colAddress.update({_id: addrId},updAddress, {}, function(err, address){
        if(err){
          res.send(err);
        }
        res.json(address);
    });
    }
    client.close();
  });
});

module.exports = router;
