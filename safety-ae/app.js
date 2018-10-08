/*******************************************************************************
 * Copyright (c) 2018 Sensinov (www.sensinov.com)
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var config = require('./config.json');
var cseUri = config.csePoa+"/~/"+config.cseId+"/"+config.cseName;
app.use(bodyParser.json());

app.listen(config.aePort, function () {
	console.log('AE Safety listening on port '+config.aePort);
});

app.post('/', function (req, res) {
	console.log("\n◀◀◀◀◀")
	console.log(req.body);

	var content = req.body["m2m:sgn"].nev.rep["m2m:cin"].con;
	var jsoncon = JSON.parse(content);
	console.log("beaconLightOn: "+jsoncon.beaconLightOn);
	beaconLightOn= jsoncon.beaconLightOn;

	jsoncon.detectionTime="";
	jsoncon.referenceTime="";
	jsoncon.eventPosition="";
	jsoncon.originatingStationType ="";
	jsoncon.eventSpeed="";
	jsoncon.eveeventPositionHeadingntSpeed="";
	jsoncon.traces="";
	
	if(beaconLightOn){
		jsoncon.triggerActivated=true;
	}else{
		jsoncon.triggerActivated=false;
	}

	createContenInstance(JSON.stringify(jsoncon));
	res.sendStatus(204);
});

createAE();

function createAE(){
	console.log("\n▶▶▶▶▶");

	var representation = {
		"m2m:ae":{
			"rn":config.aeName,			
			"api":config.appId,
			"rr":"true",
			"poa":["http://"+config.aeIp+":"+config.aePort+"/"]
		}
	};

	console.log("POST "+cseUri);
	console.log(representation);

	var options = {
		uri: cseUri,
		method: "POST",
		headers: {
			"X-M2M-Origin": config.aeId,
			"X-M2M-RI": "123456",
			"Content-Type": "application/json;ty=2"
		},
		json: representation
	};

	request(options, function (error, response, body) {
		console.log("◀◀◀◀◀");
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
			console.log(body);
			createSubscription();
		}
	});
}

function createSubscription(){
	console.log("\n▶▶▶▶▶");

	var representation = {
		"m2m:sub": {
			"rn": config.subName,
			"nu": ["/"+config.cseName+"/"+config.aeId],
			"nct": 2,
			"enc": {
				"net": 3
			}
		}
	};

	console.log("POST "+cseUri+"/"+config.subscribeToCnt);
	console.log(representation);

	var options = {
		uri: cseUri+"/"+config.subscribeToCnt,
		method: "POST",
		headers: {
			"X-M2M-Origin": config.aeId,
			"X-M2M-RI": "123456",
			"Content-Type": "application/json;ty=23"
		},
		json: representation
	};

	request(options, function (error, response, body) {
		console.log("◀◀◀◀◀");
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
			console.log(body);
			if(response.statusCode=="404"){
				console.log("Trying to subscribe again in 5s");
				setTimeout(function() {
					createSubscription();
				}, 5000);
				
			}
		}
	});
}




function createContenInstance(con){
	console.log("\n▶▶▶▶▶");

	var representation = {
		"m2m:cin":{
				"con": con
			}
		};

	console.log("POST "+cseUri+"/"+config.triggerCnt);
	console.log(representation);

	var options = {
		uri: cseUri+"/"+config.triggerCnt,
		method: "POST",
		headers: {
			"X-M2M-Origin": config.aeId,
			"X-M2M-RI": "123456",
			"Content-Type": "application/json;ty=4"
		},
		json: representation
	};

	request(options, function (error, response, body) {
		console.log("◀◀◀◀◀");
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
			console.log(body);
		}
	});
}
