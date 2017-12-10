const express = require('express');
const router = express.Router();
const monk = require('monk');

let sess;

/* GET load */
router.get('/load', async (req, res, next) => {
  let responseJson = {};
  sess = req.session;
  if (!sess.userId) {
    res.send("");
  } else {
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
    console.log(friend_data);
    const messageCollection = db.get('messageList');
    const message_promise = friend_data.map(friend => {
      let friend_id = friend._id.toString();
      return messageCollection.find({$or: [{senderId: friend_id, receiverId:user._id.toString()}, {senderId:user._id.toString(), receiverId: friend_id}]});
    });
    const message_list = await Promise.all([...message_promise]);
    message_list.forEach((message_collection, index) => {
      let unread_messages = 0;
      for (let i = 0; i < message_collection.length; ++i) {
        console.log(`message_collection[i]._id is ${message_collection[i]._id} and the other value is ${user.friends[index].lastMsgId}`);
        if (message_collection[i]._id == user.friends[index].lastMsgId) {
          for (let j = i; j < message_collection.length; j++) {
            unread_messages++;
          }
          break;
        }
      }
      if (unread_messages > 0) {
        unread_messages--;
      }
      friend_data[index].unread_counter = unread_messages;
    });
    responseJson = {
      _id: user._id,
      name: user.name,
      icon: user.icon,
      friends: friend_data
    };
    console.log(responseJson);
    res.json(responseJson);
  }
});

/* POST login */
router.post('/login', async (req, res, next) => {
  const db = req.db;
  const collection = db.get('userList');
  const username = req.body.username;
  const password = req.body.password;
  collection.find({name:username, password:password}, async (err, docs) => {
    if (err === null) {
      if (docs.length === 0) {
        // invalid
        res.send({
          msg:'LOGIN INVALID'
        });
      } else {
        req.session.userId = docs[0]._id;
        await collection.update({_id: req.session.userId}, {$set: {status: 'online'}});
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
router.get('/logout', async (req, res, next) => {
  const db = req.db;
  const collection = db.get('userList');
  await collection.update({_id: req.session.userId}, {$set: {status: 'offline'}});
  req.session.destroy(err => {
    res.send('');
  });
});

/* GET getUserInfo */
router.get('/getuserinfo', async (req, res, next) => {
  const db = req.db;
  const collection = db.get('userList');
  try {
    const user = await collection.findOne({_id: req.session.userId});
    const responseJSON = {
      'mobileNumber': user.mobileNumber,
      'homeNumber': user.homeNumber,
      'address': user.address
    }
    res.json(responseJSON);
  } catch (err) {
    res.send({msg:err});
  }
});

/* PUT saveUserInfo */
router.put('/saveuserinfo', async (req, res, next) => {
  const db = req.db;
  const collection = db.get('userList');
  try {
    await collection.update({_id:req.session.userId}, {$set: {mobileNumber: req.body.mobileNumber, homeNumber: req.body.homeNumber, address: req.body.address}});
    res.send("");
  } catch (err) {
    res.send({msg: err});
  }
});

/* GET get conversation with friend */
router.get('/getconversation/:friendid', async (req, res, next) => {
  const friendId = req.params.friendid;
  const db = req.db;
  const collection = db.get('userList');
  const messageCollection = db.get('messageList');
  const id = monk.id(friendId);
  const friend = await collection.findOne({_id:id}, {fields: {name: 1, icon: 1, status: 1}});
  let messageList;
  const user_id = (req.session.userId).toString();
  try {
    messageList = await messageCollection.find({$or: [{senderId: friendId, receiverId:user_id}, {senderId:user_id, receiverId: friendId}]});
    await collection.update({_id: user_id, "friends.name": friend.name}, {$set: {"friends.$.lastMsgId": messageList[messageList.length-1]._id.toString()}});    
  } catch(err) {
    messageList = {};
  }
  friend.messageList = messageList;
  res.json(friend);
});

/* POST send message to friend */
router.post('/postmessage/:friendid', async (req, res, next) => {
  const friendId = req.params.friendid;
  const db = req.db;
  const collection = db.get('messageList');
  try {
    await collection.insert({senderId:req.session.userId, receiverId:friendId, message:req.body.message, date:req.body.date, time: req.body.time});
    const messageId = await collection.findOne({senderId:req.session.userId, receiverId:friendId, message:req.body.message, date:req.body.date, time: req.body.time});
    res.send(messageId);
  } catch (err) {
    res.send({msg:err});
  }
});

/* DELETE message */
router.delete('/deletemessage/:msgid', async (req, res, next) => {
  const db = req.db;
  const messageCollection = db.get('messageList');
  const collection = db.get('userList');
  const msgId = req.params.msgid;
  const user_id = req.session.userId;
  console.log(`now deleting ${monk.id(msgId)}`);
  await messageCollection.remove({_id:monk.id(msgId)});
});

/* GET getnewmessages */
router.get('/getnewmessages/:friendid', async (req, res, next) => {
  let toggleAdd = false;
  let message_not_retrieved = [];
  let all_messages_id;
  const db = req.db;
  const collection = db.get('userList');
  const messageCollection = db.get('messageList');
  const friendId = req.params.friendid;
  const friend = await collection.findOne({_id: monk.id(friendId)});
  const user = await collection.findOne({_id: req.session.userId});
  try {
    for (let i = 0; i < user.friends.length; i++) {
      if (user.friends[i].name == friend.name) {
        messageList = await messageCollection.find({senderId:friendId, receiverId:req.session.userId.toString()});
        for (let j = 0; j < messageList.length; j++) {
          if (messageList[j]._id == user.friends[i].lastMsgId) {
            toggleAdd = true;
          }
          if (toggleAdd === true) {
            message_not_retrieved.push(messageList[j]);
          }
        }
        all_messages_id = await messageCollection.find({$or: [{senderId: friendId, receiverId:req.session.userId.toString()}, {senderId:req.session.userId.toString(), receiverId: friendId}]});
        break;
      }
    }
    const responseJson = {
      'status': friend.status,
      'message_not_retrieved': message_not_retrieved,
      'messages_id': all_messages_id
    }
    res.json(responseJson);
  } catch(err) {
    res.send({msg:err});
  }
});

/* GET getnewmessagenumber */
router.get('/getnewmsgnum/:friendid', async (req, res, next) => {
  let toggleAdd = false;
  let message_not_retrieved = 0;
  const db = req.db;
  const collection = db.get('userList');
  const messageCollection = db.get('messageList');
  const friendId = req.params.friendid;
  const friend = await collection.findOne({_id: monk.id(friendId)});
  const user = await collection.findOne({_id: req.session.userId});
  try {
    for (let i = 0; i < user.friends.length; i++) {
      if (user.friends[i].name == friend.name) {
        // messageList = await messageCollection.find({senderId:friendId, receiverId:req.session.userId.toString()});
        messageList = await messageCollection.find({$or: [{senderId: friendId, receiverId:req.session.userId.toString()}, {senderId:req.session.userId.toString(), receiverId: friendId}]});
        for (let j = 0; j < messageList.length; j++) {
          if (toggleAdd === true) {
            message_not_retrieved++;
          }
          if (messageList[j]._id == user.friends[i].lastMsgId) {
            toggleAdd = true;
          }
        }
        break;
      }
    }
    const responseJson = {
      'message_not_retrieved': message_not_retrieved
    }
    res.json(responseJson);
  } catch(err) {
    res.send({msg:err});
  }
});

module.exports = router;