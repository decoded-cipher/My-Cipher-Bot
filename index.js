process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1060187211:AAG4N-2oGbyLQRf-VPPJ2sOIXhOKRyyv25M';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// const firebaseConfig = {
//     apiKey: "AIzaSyB28S5IBW23PntFWynQqB33ZzGkzQnf9mI",
//     authDomain: "my-cipher-bot.firebaseapp.com",
//     databaseURL: "https://my-cipher-bot.firebaseio.com/",
//     projectId: "my-cipher-bot",
//     storageBucket: "my-cipher-bot.appspot.com",
//     messagingSenderId: "160844162176",
//     appId: "1:160844162176:web:22f27f0f24d71bf50bb265",
//     measurementId: "G-R7KLMTPJ1S"
//   };

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});

// const firebase = require('firebase');
// firebase.initializeApp(firebaseConfig);

// const ref = firebase.database().ref();
// const sitesRef = ref.child("sites");

let siteUrl;
bot.onText(/\/bookmark (.+)/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id,'Got it Arjun. Which category does it belong to...?', {
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
            text: 'Others',
            callback_data: 'Others'
          }
      ]]
    }
  });
});

// bot.on("callback_query", (callbackQuery) => {
//     const message = callbackQuery.message;
//     ogs({'url': siteUrl}, function (error, results) {
//       if(results.success) {
//         sitesRef.push().set({
//           name: results.data.ogSiteName,
//           title: results.data.ogTitle,
//           description: results.data.ogDescription,
//           url: siteUrl,
//           thumbnail: results.data.ogImage.url,
//           category: callbackQuery.data
//         });
//         bot.sendMessage(message.chat.id,'Added \"' + results.data.ogTitle +'\" to category \"' + callbackQuery.data + '\"!')
//   } else {
//         sitesRef.push().set({
//           url: siteUrl
//         });
//         bot.sendMessage(message.chat.id,'Added new website, but there was no OG data!');
//       }
//     });
//   });