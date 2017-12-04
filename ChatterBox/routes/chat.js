const express = require('express');
const router = express.Router();
const monk = require('monk');

let sess;

/* GET load */
router.get('/load', (req, res, next) => {
  let responseJson = {};
  sess = req.session;
  // console.log(`the session id is ${req.session.userId}`);
  if (!sess.userId) {
    res.send("");
  } else {
    async function returnLoad() {
      const db = req.db;
      let responseJson = {};
      let friends_arr = [];
      const collection = db.get('userList');
      const filter = {_id : sess.userId};
      const user = await collection.findOne(filter);
      const friend_promise = user.friends.map(friend => {
        return collection.findOne({name:friend.name}, {fields: {name:1}});
      });
      const friend_data = await Promise.all([...friend_promise]);
      // console.log(friend_data);
      const messageCollection = db.get('messageList');
      const message_promise = friend_data.map(friend => {
        let friend_id = friend._id.toString();
        return messageCollection.find({senderId: friend_id, receiverId:req.session.userId});
      });
      const message_list = await Promise.all([...message_promise]);
      // console.log(message_list);
      message_list.forEach((message_collection, index) => {
        let unread_messages = 0;
        friend_data[index].unread_counter = 0;
        for (let i = 0; i < message_collection.length; ++i) {
          if (message_collection[i] == friend_data[index].lastMsgId) {
            friend_data[index].unread_counter = unread_messages;
            break;
          } else if (i==message_collection.length-1){
            friend_data[index].unread_counter = unread_messages + 1;
            break;
          }
          unread_messages++;
        }
      });
      responseJson = {
        name: user.name,
        icon: user.icon,
        friends: friend_data
      };
      // console.log(responseJson);
      res.json(responseJson);
    }
    returnLoad();
  }
});

/* POST login */
router.post('/login', (req, res, next) => {
  const db = req.db;
  const collection = db.get('userList');
  const username = req.body.username;
  const password = req.body.password;
  collection.find({name:username, password:password}, (err, docs) => {
    if (err === null) {
      if (docs.length === 0) {
        // invalid
        res.send({
          msg:'LOGIN INVALID'
        });
      } else {
        req.session.userId = docs[0]._id;
        // console.log(`The userId is ${req.session.userId}`);
        collection.update({_id: req.session.userId}, {$set: {status: 'online'}});
        const responseJSON = {
          'name' : docs[0].name,
          'icon' : docs[0].icon,
          'friends' : docs[0].friends
        }
        res.json(responseJSON);
      }
    }
  });
});

/* GET logout */
router.get('/logout', (req, res, next) => {
  const db = req.db;
  const collection = db.get('userList');
  collection.update({_id: req.session.userId}, {$set: {status: 'online'}});
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
        'mobileNumber': docs[0].mobileNumber,
        'homeNumber': docs[0].homeNumber,
        'address': docs[0].address
      }
      res.send(responseJSON);
    } else {
      res.send({msg:err});
    }
  });
});

/* PUT saveUserInfo */
router.put('/saveuserinfo', (req, res, next) => {
  const db = req.db;
  const collection = db.get('userList');
  collection.update({_id:req.session.userId}, {mobileNumber: req.body.mobileNumber, homeNumber: req.body.homeNumber, address: req.body.address}, (err, result) => {
    res.send((err === null)?{msg:""}:{msg:err});
  });
});

/* GET get conversation with friend */
// TODO
router.get('/getconversation/:friendid', (req, res, next) => {

  async function loadConversation() {
    const friendId = req.params.friendid;
    const db = req.db;
    const collection = db.get('userList');
    const messageCollection = db.get('messageList');
    const id = monk.id(friendId);
    const friend = await collection.findOne({_id:id}, {fields: {name: 1, icon: 1, status: 1}});
    // console.log(`the friend is ${friend}`);
    // const user_id = (req.session.userId).toString();
    const messageSentByFriend = await messageCollection.find({senderId: friendId, receiverId:'5a22e40c7ff807811558c2de'});
    // console.log(messageSentByFriend);
    const messageReceivedByFriend = await messageCollection.find({senderId:'5a22e40c7ff807811558c2de', receiverId: friendId});
    // console.log(messageSentByFriend[0]._id.toString());
    collection.update({_id:"5a22e40c7ff807811558c2de", "friends.name": friend.name}, {$set: {"friends.$.lastMsgId": messageSentByFriend[0]._id.toString()}});
    friend.messageSentByFriend = messageSentByFriend;
    friend.messageReceivedByFriend = messageReceivedByFriend;
    // console.log(friend);
    res.json(friend);
  }
  loadConversation();

});

/* POST send message to friend */
router.post('/postmessage/:friendid', (req, res, next) => {
  const friendId = req.params.friendid;
  const db = req.db;
  const collection = db.get('messageList');
  collection.insert({senderId:req.session.userId, receiverId:friendId, message:req.body.message, date:req.body.date, time: req.body.time}, (err, result) => {
    res.send((err === null)?req.session.userId:{msg:err});
  });
});

/* DELETE message */
router.delete('/deletemessage/:msgid', (req, res, next) => {
  const db = req.db;
  const collection = db.get('messageList');
  const msgId = req.params.msgid;
  collection.remove({_id:msgId});
}); 

/* GET getnewmessages */
router.get('/getnewmessages/:friendid', (req, res, next) => {

});

/* GET getnewmessagenumber */

module.exports = router;