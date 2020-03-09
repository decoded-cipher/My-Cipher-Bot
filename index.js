var bot = new (require('telecore'))({
  "token": "1060187211:AAG4N-2oGbyLQRf-VPPJ2sOIXhOKRyyv25M",
  "webhook": true,
  "hook": {
    "port": process.env.PORT || 443,
    "host": "localhost",
    "url": "https://my-cipher-bot.herokuapp.com"
  }
});


bot.on('/start', function(msg, args) {
  bot.api.sendMessage({
    "chat_id": msg.chat.id,
    "text": "Group Id:"+msg.chat.id+"\n Sender:"+msg.from.id
  });
});
 
bot.on('/help', function(msg, args) {
  bot.api.sendMessage({
    "chat_id": msg.chat.id,
    "text": "I am a Telegrambot that echos the group chat id and the users ID of user who sends /start"
  });
});
 

