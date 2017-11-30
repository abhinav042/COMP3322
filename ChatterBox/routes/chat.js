var express = require('express');
var router = express.Router();
let sess;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET load */
router.get('/load', (req, res, next) => {
  sess = req.session;
  if (!sess.userId) {
    res.send('');
  } else {
    const db = req.db;
    const collection = db.get('userList');
    const filter = {_id : sess.userId};
    collection.find(filter, (err, docs) => {
      res.json(docs);
    });
  }
});

/* POST login */
router.post('/login', (req, res, next) => {
  const db = req.db;
  const collection = db.get('userList');
  const username = req.body.username;
  const password = req.body.password;
  const filter = {
    username, 
    password
  };
  collection.find(filter, (err, docs) => {
    if (err === null) {
      if (docs.length === 0) {
        // invalid
        res.send('LOGIN INVALID');
      } else {
        req.session.userId = docs._id;
        collection.update({_id: req.session.userId}, {status: 'Online'});
        const responseJSON = {
          'name' : docs.name,
          'icon' : docs.icon,
          'friends' : docs.friends
        }
        res.send(responseJSON);
      }
    }
  });
});

/* GET logout */
router.get('/logout', (req, res, next) => {
  const db = req.db;
  const collection = db.get('userList');
  collection.update({_id: req.session.userId}, {status: 'Offline'});
  req.session.userId = null;
  res.send('');
});

/* GET getUserInfo */
router.get('/getuserinfo', (req, res, next) => {
  const db = req.db;
  const collection = db.get('userList');
  collection.find({_id:req.session.userId}, (err, docs) => {
    if (err === null) {
      const responseJSON = {
        mobileNumber,
        homeNumber,
        address
      }
      res.json(responseJSON);
    } else {
      res.send({msg:err});
    }
  });
});

/* PUT saveUserInfo */
router.put('/saveuserinfo', (req, res, next) => {
  const db = req.db;
  const collection = db.get('userList');
  collection.find({_id:req.session.userId}, (err, docs) => {
    if (err === null) {
      collection.update({mobileNumber: req.body.mobileNumber, homeNumber: req.body.homeNumber, address: req.body.address}, (err, msg) => {
        res.send((err === null)?{msg:""}:{msg:err});
      });
    } else {
      res.send({msg:err});
    }
  });
});

/* GET get conversation with friend */
router.get('/getconversation/:friendid', (req, res, next) => {
  let friend;
  const friendId = req.params.friendid;
  const db = req.db;
  const collection = db.get('userList');
  let icon;
  let messageList;
  collection.find({_id:friendid}, (err, docs) => {
    if (err === null) {
      const messageCollection = db.get('messageList');
      icon = docs.icon;
      messageList = 

    }
  });
});

/* POST send message to friend */
router.post('/')


module.exports = router;