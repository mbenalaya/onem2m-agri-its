/*******************************************************************************
 * Copyright (c) 2018 Sensinov (www.sensinov.com)
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/

var express = require('express');
var request = require('request');
var fs = require('fs');
var config = require('./config.json');

createAE();
function createAE(){
	console.log("\n▶▶▶▶▶");
	var representation = {
		"m2m:ae":{
			"rn":config.aeName,			
			"api": config.appId,
			"rr":"false"
		}
	};
	console.log("POST "+config.cseUri);
	console.log(representation);

	var options = {
		uri: config.cseUri,
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
			createContainer();
		}
	});
}


function createContainer(){
	console.log("\n▶▶▶▶▶");

	var representation = {
		"m2m:cnt":{
			"rn":config.cntName,
			"mni":config.cntMni		

		}
	};

	console.log("POST "+config.cseUri+"/"+config.aeName);
	console.log(representation);

	var options = {
		uri: config.cseUri+"/"+config.aeName,
		method: "POST",
		headers: {
			"X-M2M-Origin": config.aeId,
			"X-M2M-RI": "123456",
			"Content-Type": "application/json;ty=3"
		},
		json: representation
	};

	request(options, function (error, response, body) {
		console.log("◀◀◀◀◀");
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
			createContentInstance();
			console.log(body);
			setInterval(function() {
				createContentInstance();
			}, config.sleepTime);
		}
	});
}

function createContentInstance(){
	console.log("\n----------------------------------");
	console.log("Read iso11783 json file");
	var content = fs.readFileSync("iso11783.json");
	console.log("Content : \n"+ content);
	console.log("▶▶▶▶▶");

	var representation = {
		"m2m:cin":{
			"con": JSON.stringify(JSON.parse(content))
		}
	};

	console.log("POST "+config.cseUri+"/"+config.aeName+"/"+config.cntName);
	console.log(representation);

	var options = {
		uri: config.cseUri+"/"+config.aeName+"/"+config.cntName,
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
			console.log("----------------------------------");
			console.log("Sleep "+config.sleepTime +" ms..");

		}
	});
}
