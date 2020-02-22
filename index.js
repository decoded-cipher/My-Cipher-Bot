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

let siteUrl;

// Reply to /bookmark
bot.onText(/\/bookmark_url (.+)/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id,'Got it Arjun, Just specify the category?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'HTML',
          callback_data: 'HTML'
        },{
          text: 'CSS',
          callback_data: 'CSS'
        },{
          text: 'JavaScript',
          callback_data: 'JavaScript'
        },{
            text: 'PHP',
            callback_data: 'PHP'
          },{
            text: 'Others',
            callback_data: 'Others'
          }
      ]]
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
      bot.sendMessage(message.chat.id,'You added a new website. Ill store it in my database. Just ring me when its needed...');
    }
  });
});