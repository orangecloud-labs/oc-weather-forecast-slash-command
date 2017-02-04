var express = require('express');
var app = express();
var url = require('url');
var request = require('request');
var config = require('./config');

var apikey =  config.wu;

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  

app.set('port', (process.env.PORT || 3000));  

app.get('/', function(req, res){   res.send('Running!!'); });  

app.post('/weather', function(req, res){   
	
	var query = req.body.text;
	var splitedQuery = query.split(/[\s]\-/);
	var place = splitedQuery[0];
	var flag = splitedQuery[1];

	if(typeof flag != 'undefined'){
		switch(flag){
			case 'd':
				var parsed_url = url.format({     
					pathname: 'http://api.wunderground.com/api/' + apikey + '/forecast/q/' + place + '.json',   
				});
				
				request(parsed_url, function (error, response, body) {     
					var d = JSON.parse(body);
					if(d.hasOwnProperty('forecast') === false){ 
						res.send('No cities match your search query'); 
						return;
					}
					if (!error && response.statusCode == 200) {       
						var data = JSON.parse(body);       
						var day = data.forecast.simpleforecast.forecastday[0];
						var icon_url = day.icon_url;       
						var location = place;
						var body = {         
							response_type: "in_channel",
			        	 			"attachments": [{            
								"author_name": "Orange Cloud",
								"color":"#00BFFF",
								"title": "Day forecast, " + day.date.pretty,
				 				"text": "" + location + ", *low " + day.low.celsius + "°C " + "" + ", high " + day.high.celsius +"°C*\n"                   
								+ data.forecast.txt_forecast.forecastday[0].fcttext_metric,             
								"image_url": icon_url + "\n",           
								"footer": "<https://github.com/m4r35>",
								"mrkdwn_in": [
						         		"text"       
								]
					  			}]       
						};       
						res.send(body);
						return;     
					}
					res.send('Error ocurred, please try again later!');   
					return;
				}); 
			break;
			default:
				return;	
		}
	}else{
		var parsed_url = url.format({     
			pathname: 'http://api.wunderground.com/api/' + apikey + '/conditions/q/' + place + ".json",   
		});
		request(parsed_url, function (error, response, body) {     
			var d = JSON.parse(body);
			if(d.hasOwnProperty('current_observation') === false){ 
				res.send('No cities match your search query'); 
				return;
			}
			if (!error && response.statusCode == 200) {       
				var data = JSON.parse(body);       
				var temperature = data.current_observation.temp_c;       
				var weatherCondition = data.current_observation.weather       
				var icon_url = data.current_observation.icon_url       
				var location = data.current_observation.display_location.full        
				var body = {         
					response_type: "in_channel",
			        	 	"attachments": [{            
						"author_name": "Orange Cloud",
						"color":"#00BFFF",
						"title": "" + data.current_observation.observation_time,
				 		"text": "" + location + ", *" + temperature + "°C " + weatherCondition + "*, _feels like " + data.current_observation.feelslike_c +"°C_\n"                   
						+ "Wind: " + data.current_observation.wind_string,             
						"image_url": icon_url + "\n",           
						"footer": "<https://github.com/m4r35>",
						"mrkdwn_in": [
						         "text"       
						]
					  	}]       
				};       
				res.send(body);
				return;     
			}
			res.send('Error ocurred, please try again later!');   
			return;
		}); 
	}
});  

app.listen(app.get('port'), function() {   
	console.log('Node app is running on port', app.get('port')); 
});
