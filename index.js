var PORT = process.env.PORT || 3000;

require('dotenv').config()
process.env.NTBA_FIX_319 = 1;

var request = require('request');
const TelegramBot = require('node-telegram-bot-api');

// Bot config
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {
  polling: true
});

// Reply to /start
bot.onText(/\/start/, (msg, match) => {
  const start = match.input.split(' ')[1];

  // var start = match[1];
  // console.log(start);

  var chatId = msg.chat.id;
  if (start === undefined) {
    bot.sendMessage(
      chatId, 'Welcome, " ' + msg.chat.first_name + ' ' + msg.chat.last_name +
      ' " to " My Cipher Bot ",\nThe personalized Telegram Bot for self-learning and ' +
      '\nself-experimenting adventures on anything and everything, \nfor own creator " Mr. Arjun Krishna ".\n🙂'
    );
    // return;

    setTimeout(() => {
      bot.sendMessage(
        chatId, '😂 Sorry for being so official in words at the first time... 😂'
      );
    }, 500);
    // return;

    setTimeout(() => {
      bot.sendMessage(
        chatId, 'Hello ' + msg.chat.first_name + ',' + '\nMyself Cipher Bot. \nI am the personal telegram assistant of " Mr. Decoded_Cipher ".' +
        '\nSorry, " Mr. Arjun Krishna ".' +
        '\n\nI was built for serving purposes, that my creator finds it boring, but useful and is essential.' +
        ' He also let me serve his friends and collegues, who may share his same feeling.' +
        '\n\nYou can access my features by utilizing the commands listed, that precede a "/" symbol.' +
        '\nWhat are you waiting for... \nLet us dig in...\n🙂'
      );
    }, 1000);
    // return;

    setTimeout(() => {
      bot.sendMessage(
        chatId, 'Let these examples guide you to use the commands effectively:' +
        '\n\n-  /hellobot Hai - Waiting for your message\n("Hai" is any message)' +
        '\n-  /movie Avatar - For Movie details\n("Avatar" is any movie name)' +
        '\n-  /article Bitcoin - For blogs and articles\n("Bitcoin" is any keyword)' +
        '\n-  /news Covid - For daily news updations\n("Covid" is any news keyword)' +
        '\n-  /weather Kottayam - For weather updation\n("Kottayam" is any main location)'
      );
    }, 2000);
    // return;

    setTimeout(() => {
      bot.sendMessage(
        chatId, 'Hey, What are you waiting for... \n Just try something...'
      );
    }, 3000);
    return;
  }
});



// Reply to /hellobot
bot.onText(/\/hellobot (.+)/, (msg, match) => {
  bot.sendMessage(msg.chat.id, 'Ahoy Pirate. Its me, your Cipher Bot. Thanks for your call. But, dont disturb me for an hour or so. Let me have a nap. Im feeling so sleepy. Bye.');
});



// Reply to /movie
bot.onText(/\/movie (.+)/, (msg, match) => {
  var movie = match[1];
  var chatId = msg.chat.id;
  request(`http://www.omdbapi.com/?apikey=82043cb7&t=${movie}`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      bot.sendMessage(chatId, '_Looking for _' + movie + '...', {
          parse_mode: 'Markdown'
        })

        // bot.sendMessage(chatId, 'Result:\n' + body)

        .then(function (msg) {
          var res = JSON.parse(body);

          // console.log(res);

          bot.sendPhoto(chatId, res.Poster, {
            caption: 'Result: \nTitle: ' + res.Title +
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

  request(`https://api.openweathermap.org/data/2.5/weather?appid=${process.env.WEATHER_TOKEN}&q=${weather}`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      bot.sendMessage(chatId, `_Fetching weather details from ${weather}..._`, {
          parse_mode: 'Markdown'
        })
        .then(function (msg) {
          var res = JSON.parse(body);

          // console.log(res);

          var temperature = Math.floor(res.main.temp - 273.15);
          var sky, clouds = res.clouds.all;

          if (clouds >= 0 && clouds <= 10)
            sky = 'Clear Sky';
          else if (clouds >= 11 & clouds <= 25)
            sky = 'Few Clouds';
          else if (clouds >= 26 & clouds <= 50)
            sky = 'Scattered Clouds';
          else if (clouds >= 51 & clouds <= 84)
            sky = 'Broken Clouds';
          else
            sky = 'Overcast Clouds';

          var sec = res.dt;
          var date = new Date(sec * 1000);
          var presentTime = date.toLocaleTimeString();
          // console.log(date);

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

  request(`http://newsapi.org/v2/top-headlines?q=${news}&apiKey=${process.env.NEWS_TOKEN}&country=in`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      bot.sendMessage(chatId, `_Fetching today's headlines on ${news}..._`, {
          parse_mode: 'Markdown'
        })
        .then(function (msg) {
          var res = JSON.parse(body);

          // console.log(res);

          for (var result = 1; result <= res.totalResults; result++) {

            var d = new Date(res.articles[result - 1].publishedAt);
            var presentTime = d.toLocaleTimeString();
            var presentDate = d.toLocaleDateString();

            // console.log(presentTime);
            // console.log(presentDate);
            // console.log(d);

            bot.sendMessage(chatId,
              'Source :  ' + res.articles[result - 1].source.name + '\n' +
              'Author:  ' + res.articles[result - 1].author + '\n' +
              'Published At :  ' + presentDate + ', ' + presentTime + '\n\n' +
              res.articles[result - 1].title + '\n\n' +
              res.articles[result - 1].description + '\n\n' +
              res.articles[result - 1].content + '\n\n' +
              'Link :\n' + res.articles[result - 1].url
            )
          }
        })
    }
  })
})



// Reply to /articles
bot.onText(/\/articles (.+)/, (msg, match) => {
  var article = match[1];
  var chatId = msg.chat.id;

  request(`http://newsapi.org/v2/everything?q=${article}&apiKey=${process.env.NEWS_TOKEN}`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      bot.sendMessage(chatId, `_Fetching recent articles on ${article}..._`, {
          parse_mode: 'Markdown'
        })
        .then(function (msg) {
          var res = JSON.parse(body);

          // console.log(res);

          for (var result = 1; result <= res.totalResults; result++) {

            var d = new Date(res.articles[result - 1].publishedAt);
            var presentTime = d.toLocaleTimeString();
            var presentDate = d.toLocaleDateString();

            bot.sendMessage(chatId,
              'Source :  ' + res.articles[result - 1].source.name + '\n' +
              'Author:  ' + res.articles[result - 1].author + '\n' +
              'Published At :  ' + presentDate + ', ' + presentTime + '\n\n' +
              res.articles[result - 1].title + '\n\n' +
              res.articles[result - 1].description + '\n\n' +
              res.articles[result - 1].content + '\n\n' +
              'Link :\n' + res.articles[result - 1].url
            )
          }
        })
    }
  })
})



// Reply to /search

// bot.onText(/\/search (.+)/, (msg, match) => {
//   var search = match[1];
//   var chatId = msg.chat.id;

//   console.log(search);

//   request(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&titles=${search}`, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       bot.sendMessage(chatId, `_Searching details of ${search} on Wikipedia..._`, {
//           parse_mode: 'Markdown'
//         })
//         .then(function (msg) {
//           var res = JSON.parse(body);
//           bot.sendMessage(chatId, body.query.pages);

//           console.log(res);
//           console.log(res.query.pages);
//         })
//     }
//   })
// })



// Reply to /covid

// bot.onText(/\/covid/, (msg, match) => {
//   const corona = match.input.split(' ')[1];
//   var chatId = msg.chat.id;
//   if (corona === undefined) {

//     bot.sendMessage(msg.chat.id, 'Got it ' + msg.chat.first_name + ', What you want to know...?', {
//       reply_markup: {
//         inline_keyboard: [
//           [{
//             text: 'Global Status',
//             callback_data: 'global'
//           }, {
//             text: 'National Status',
//             callback_data: 'national'
//           }]
//         ]
//       }
//     });

//   }
// });

// bot.on("callback_query", (callback_Query) => {
//   const message = callback_Query.message;
//   if (callback_Query.data == 'global') {
//     // console.log('Global');

//     request(`https://thevirustracker.com/free-api?global=stats`, function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//         bot.sendMessage(message.chat.id, '_Looking for _' + '_covid updates around the globe_' + '...', {
//             parse_mode: 'Markdown'
//           })
//           .then(function (msg) {
//             var res = JSON.parse(body);
//             // console.log(res)
//             // console.log(res.results[0].total_new_cases_today)

//             bot.sendMessage(message.chat.id,
//               'Result:\nTotal Affected Countries :  ' + res.results[0].total_affected_countries +
//               '\n\nNew Cases Today :  ' + res.results[0].total_new_cases_today +
//               '\nNew Deaths Today :  ' + res.results[0].total_new_deaths_today +
//               '\n\nTotal Active Cases :  ' + res.results[0].total_active_cases +
//               '\nTotal Serious Cases :  ' + res.results[0].total_serious_cases +
//               '\nTotal Deaths :  ' + res.results[0].total_cases
//             )

//           })

//       }
//     });

//   } else {

//     request(`https://thevirustracker.com/free-api?countryTimeline=IN`, function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//         bot.sendMessage(message.chat.id, '_Looking for _' + '_covid updates around the globe_' + '...', {
//             parse_mode: 'Markdown'
//           })
//           .then(function (msg) {
//             var res = JSON.parse(body);
//             console.log(res.timelineitems[0]);

//             // for (var result = 1; result <= res.totalResults; result++) {
//             //   console.log(res.timelineitems[0].object[result]);
//             // }

//           })
//       }
//     });

//   }
//   return;
// });

// function ObjectLength( object ) {
//   var length = 0;
//   for( var key in object ) {
//       if( object.hasOwnProperty(key) ) {
//           ++length;
//       }
//   }
//   return length;
// };