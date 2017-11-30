const express = require('express');
const router = express.Router();

/*
* GET annualReport
*/
router.get('/annualreports', (req, res) => {
  const db = req.db;
  const collection = db.get('annualReports');

  collection.find({},{},function(err,docs){
    if (err === null)
    	res.json(docs);
		else res.send({msg: err });
    });
});

/*
* PUT to add/update report
*/
router.put('/addorupdatereport', (req, res) => {
	const db = req.db;
	const collection = db.get('annualReports');
	const company = req.body.company;
	const year = req.body.year;
	const profit = req.body.profit;
	const filter = {"company":company, "year":year};

	collection.find(filter, (err, docs)=> {
		if (err === null) {
			if (docs.length === 0) {
				// insert new record 
				collection.insert(req.body, (err, result) => {
					res.send((err === null)?{msg:""}:{msg:err});
				});
			} else {
				// update existing record
				collection.update(req.body, (err, result) => {
					res.send((err === null)?{msg:""}:{msg:err});
				});
			}
		} else {
			res.send({msg:err});
		}
	});
});

/*
* DELETE to delete a report
*/
router.delete('/delete/:id', (req, res) => {
	const db = req.db;
	const collection = db.get('annualReports');
	const id = req.params.id;
	
	collection.remove({_id: id}, (err, result) => {
		res.send((err === null)?{msg:""}:{msg:err});
	});
});

module.exports = router;