var PORT = process.env.PORT || 3000;

process.env.NTBA_FIX_319 = 1;

var request = require('request');

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


bot.onText(/\/movie (.+)/, (msg, match) => {
  var movie = match[1];
  var chatId = msg.chat.id;
  request(`http://www.omdbapi.com/?apikey=82043cb7&t=${movie}`,function(error,response,body) {
    if(!error && response.statusCode == 200) {
      bot.sendMessage(chatId, '_Looking for _' + movie + '...', {parse_mode: 'Markdown'})
     
      // bot.sendMessage(chatId, 'Result:\n' + body)

      .then(function(msg) {
        var res = JSON.parse(body);

        // console.log(res);
        
        // bot.sendMessage(chatId, 
        //   'Result: \nTitle: ' + res.Title + 
        //   '\nYear: ' + res.Year + 
        //   '\nRated: ' + res.Rated + 
        //   '\nReleased: ' + res.Released + 
        //   '\nRuntime: ' + res.Runtime + 
        //   '\nGenre: ' + res.Genre + 
        //   '\nDirector: ' + res.Director +
        //   '\nBoxOffice: ' + res.BoxOffice +
        //   '\nAwards:  ' + res.Awards
        // );
      
//-----------------------------------------------------------------------------------------------------------------------------------

        bot.sendPhoto(chatId, res.Poster,{caption: 
          'Result: \nTitle: ' + res.Title + 
          '\nYear:  ' + res.Year + 
          '\nRated:  ' + res.Rated + 
          '\nReleased:  ' + res.Released + 
          '\nRuntime:  ' + res.Runtime + 
          '\nGenre:  ' + res.Genre + 
          '\nLanguage:  ' + res.Language + 
          '\nDirector:  ' + res.Director +
          '\nBoxOffice:  ' + res.BoxOffice + 
          '\nProduction:  ' + res.Production +
          '\nAwards:  ' + res.Awards
        })
      })
    }
  });
});


// Reply to /weather
bot.onText(/\/weather (.+)/, (msg, match) => {
  var weather = match[1];
  var chatId = msg.chat.id;

  request(`https://api.openweathermap.org/data/2.5/weather?appid=2bcb097bf4c56ac64396c9db27e959e6&q=${weather}`,function(error,response,body) {
    if(!error && response.statusCode == 200) {
      bot.sendMessage(chatId, `_Fetching weather details from ${weather}..._`, {parse_mode: 'Markdown'})
      .then(function(msg) {
      var res = JSON.parse(body);

      // console.log(res);

      // bot.sendMessage(chatId, 'Result:\n' + body);
      // var icon_url = `http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`;
      
      var temperature = res.main.temp - 273.15;
      var sky, clouds = res.clouds.all;

      if(clouds >= 0 && clouds <= 10)
        sky = 'Clear Sky';
      else if(clouds >= 11 & clouds <= 25)
        sky = 'Few Clouds';
      else if(clouds >= 26 & clouds <= 50)
        sky = 'Scattered Clouds';
      else if(clouds >= 51 & clouds <= 84)
        sky = 'Broken Clouds';
      else
        sky = 'Overcast Clouds';

      var sec = res.dt;
      var date = new Date(sec * 1000);
      var presentTime = date.toLocaleTimeString();
      // console.log(presetTime);

      var sec = res.sys.sunrise;
      var date = new Date(sec * 1000);
      var sunrise = date.toLocaleTimeString();
      // console.log(sunrise);

      var sec = res.sys.sunset;
      var date = new Date(sec * 1000);
      var sunset = date.toLocaleTimeString();
      // console.log(sunset);
      
        bot.sendMessage(chatId,
        // bot.sendPhoto(chatId, icon_url,{caption:  
          'Result : \nCity :  ' + res.name + ', ' + res.sys.country +
          // '\nCoordinates:'   + res.name + ', ' + res.sys.country +
          '\n\nTime (IST) :  ' + presentTime +
          '\nAtmosphere :  ' + res.weather[0].main +
          '\nCloudliness :  ' + sky +
          '\nTemperature :  ' + temperature + '°C' +
          '\nHumidity :  ' + res.main.humidity + ' %' + 
          '\nPressure :  ' + res.main.pressure + ' hPa' +
          '\nWind :  ' + res.wind.speed + ' m/s ' + '| Angle :  ' + res.wind.deg + '°' +
          '\n\nSunrise :  ' + sunrise + 
          '\nSunset :  ' + sunset +
          '\n\nLatitude :  ' + res.coord.lat + '\nLongitude :  ' + res.coord.lon
        // }
        );
      })
    }
  })
})


// Reply to /news
bot.onText(/\/news (.+)/, (msg, match) => {
  var news = match[1];
  var chatId = msg.chat.id;

// bot.sendMessage(msg.chat.id,'Got it Arjun, Just specify the category?', {
//   reply_markup: {
//     inline_keyboard: [[
//       {
//         text: 'Top Headlines',
//         callback_data: 'top-headlines'
//       },{
//         text: 'Articles',
//         callback_data: 'everything'
//       }]]
//   }
// });

// // Callback query
// bot.on("callback_query", (callbackQuery) => {
//   const message = callbackQuery.message;
//   bot.answerCallbackQuery(callbackQuery.id)
//     .then(() => 
//     bot.sendMessage(message.chat.id, "You clicked " + callbackQuery.data + ""));
//     request(`http://newsapi.org/v2/${callbackQuery.data}?q=${news}&apiKey=4a0bb231b1db4357b1278797ebc07943&country=in`,function(error,response,body) {
//     if(!error && response.statusCode == 200) {  
//       var res = JSON.parse(body);
//       console.log(res);
//     }
// });

  // request(`http://newsapi.org/v2/top-headlines?q=${news}&apiKey=4a0bb231b1db4357b1278797ebc07943&pageSize=2&country=in&page=1`,function(error,response,body) {

  request(`http://newsapi.org/v2/top-headlines?q=${news}&apiKey=4a0bb231b1db4357b1278797ebc07943&country=in`,function(error,response,body) {
    if(!error && response.statusCode == 200) {
        bot.sendMessage(chatId, `_Fetching today's headlines on ${news}..._`, {parse_mode: 'Markdown'})
        .then(function(msg) {
        var res = JSON.parse(body);

        // console.log(res);

        // bot.sendMessage(chatId, 'Result:\n' + body);

        // bot.sendMessage(chatId,
        //   'Author :  ' + res.articles[0].author + '\n' +
        //   'Published At :  ' + res.articles[0].publishedAt + '\n\n' +
        //   res.articles[0].title + '\n\n' + res.articles[0].description + '\n\n' + res.articles[0].url +
        //   '\n\n' + res.articles[0].content
        // )

        for (var result = 1; result <= res.totalResults; result++) {
          bot.sendMessage(chatId,
            'Source :  ' + res.articles[result-1].source.name + '\n' +
            'Author:  '  + res.articles[result-1].author + '\n' +
            'Published At :  ' + res.articles[result-1].publishedAt + '\n\n' +
            res.articles[result-1].title + '\n\n' +
            res.articles[result-1].description + '\n\n' +
            res.articles[result-1].content + '\n\n' +
            'Link :\n' + res.articles[result-1].url
          )
        }

      })
    }
  })
})






// Reply to /article
bot.onText(/\/article (.+)/, (msg, match) => {
  var article = match[1];
  var chatId = msg.chat.id;

  request(`http://newsapi.org/v2/everything?q=${article}&apiKey=4a0bb231b1db4357b1278797ebc07943`,function(error,response,body) {
    if(!error && response.statusCode == 200) {
        bot.sendMessage(chatId, `_Fetching recent articles on ${article}..._`, {parse_mode: 'Markdown'})
        .then(function(msg) {
        var res = JSON.parse(body);

        // console.log(res);

        for (var result = 1; result <= res.totalResults; result++) {
          bot.sendMessage(chatId,
            'Source :  ' + res.articles[result-1].source.name + '\n' +
            'Author:  '  + res.articles[result-1].author + '\n' +
            'Published At :  ' + res.articles[result-1].publishedAt + '\n\n' +
            res.articles[result-1].title + '\n\n' +
            res.articles[result-1].description + '\n\n' +
            res.articles[result-1].content + '\n\n' +
            'Link :\n' + res.articles[result-1].url
          )
        }
      })
    }
  })
})
