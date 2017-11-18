var express = require('express');
var router = express.Router();
/*
* GET 
* annualReport
*/

router.get('/annualreports', function(req, res) {
var db = req.db;
var collection = db.get('annualReports');

collection.find({},{},function(err,docs){
  if (err === null)
  res.json(docs);
  else res.send({msg: err });
  });
});

module.exports = router;