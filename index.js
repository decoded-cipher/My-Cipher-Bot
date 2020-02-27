var PORT = process.env.PORT || 5000;

process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');
const ogs = require('open-graph-scraper');
const firebase = require('firebase');

// Bot config
const token = '1060187211:AAG4N-2oGbyLQRf-VPPJ2sOIXhOKRyyv25M';
const bot = new TelegramBot(token, {polling: true});

// Init Firebase
const app = firebase.initializeApp({
    apiKey: "AIzaSyB28S5IBW23PntFWynQqB33ZzGkzQnf9mI",
    authDomain: "my-cipher-bot.firebaseapp.com",
    databaseURL: "https://my-cipher-bot.firebaseio.com",
    projectId: "my-cipher-bot",
    storageBucket: "my-cipher-bot.appspot.com",
    messagingSenderId: "160844162176",
    appId: "1:160844162176:web:22f27f0f24d71bf50bb265",
    measurementId: "G-R7KLMTPJ1S"
});

const ref = firebase.database().ref();
const sitesRef = ref.child("sites");


// Reply to /hellobot
bot.onText(/\/hellobot (.+)/, (msg, match) => {  
bot.sendMessage(msg.chat.id, 'Ahoy Pirate. Its me, your Cipher Bot. Thanks for your call. But, dont disturb me for an hour or so. Let me have a nap. Im feeling so sleepy. Bye.');
});


// Reply to /bookmark
let siteUrl;
bot.onText(/\/bookmark_url (.+)/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id,'Got it Arjun, Just specify the category?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'HTML/CSS',
          callback_data: 'HTML/CSS'
        },{
          text: 'JavaScript',
          callback_data: 'JavaScript'
        },{
            text: 'PHP',
            callback_data: 'PHP'
        }],
        [{
            text: 'Node.js',
            callback_data: 'Node.js'
        },{
            text: 'Vue.js',
            callback_data: 'Vue.js'
        },{
            text: 'IoT',
            callback_data: 'IoT'
        }],
        [{
        text: 'Others',
        callback_data: 'Others'
        }]]
    }
  });
});

// Callback query
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  // Scrap OG date
  ogs({'url': siteUrl}, function (error, results) {
    if(results.success) {
      // Push to Firebase
      sitesRef.push().set({
        name: results.data.ogSiteName,
        title: results.data.ogTitle,
        description: results.data.ogDescription,
        url: siteUrl,
        thumbnail: results.data.ogImage.url,
        category: callbackQuery.data
      });
      // Reply 
      bot.sendMessage(message.chat.id,'Added \"' + results.data.ogTitle +'\" to category \"' + callbackQuery.data + '\"!');
    } else {
      // Push to Firebase
      sitesRef.push().set({
        url: siteUrl
      });
      // Reply 
      bot.sendMessage(message.chat.id,'Arjun, I think, you added something crazy. Just review your entry mahn...!');
    }
  });
});

var request = require('request');
bot.onText(/\/movie (.+)/, (msg, match) => {
  var movie = match[1];
  var chatId = msg.chat.id;
  request(`http://www.omdbapi.com/?apikey=82043cb7&t=${movie}`,function(error,response,body) {
    if(!error && response.statusCode == 200) {
      bot.sendMessage(chatId, '_Looking for _' + movie + '...', {parse_mode: 'Markdown'})
     
      bot.sendMessage(chatId, 'Result:\n' + body);

      // .then(function(msg) {
      //   var res = JSON.parse(body);
      //   bot.sendMessage(chatId, 
      //     'Result: \nTitle: ' + res.Title + 
      //     '\nYear: ' + res.Year + 
      //     '\nRated: ' + res.Rated + 
      //     '\nReleased: ' + res.Released
      //     );
      // })
    }
  });
});

