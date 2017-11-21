//Config
var config = require('./config/config');

//DETECTION persistance
var last_ts = 0;

//crypto
var CryptoJS = require("crypto-js");
var esp8266_msg;
var esp8266_iv;

//request
var request = require('request');

//timestamp
var moment = require('moment');

//Setup serial comms
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
var port = new SerialPort(config.COM_PORT, {
	baudRate: config.BAUD_RATE
});
const parser = new Readline();
port.pipe(parser);


//listen for data from serial
parser.on('data', function (data) { //when data received
  var datas = data.trim().split(":");
  //console.log(data);
  if(datas.length == 2){ //check if we received the correct data
	var curr_ts = Date.now();
	var plain_iv =  new Buffer( datas[0] , 'base64').toString('hex');
	var iv = CryptoJS.enc.Hex.parse( plain_iv );
	var key= CryptoJS.enc.Hex.parse( config.KEY );
	//decrypt
	var bytes  = CryptoJS.AES.decrypt( datas[1], key , { iv: iv} );
	var plaintext = bytes.toString(CryptoJS.enc.Base64);
	var decoded_b64msg =  new Buffer(plaintext , 'base64').toString('ascii');
	var decoded_msg = new Buffer( decoded_b64msg , 'base64').toString('ascii');
	datas = decoded_msg.trim().split(":");
	//console.log(datas);
	if(datas.length == 3){
		last_ts = curr_ts; //update timestamp
		//notify user
		var options = {
			url: 'https://188.166.235.223:55555/trigger',
			rejectUnauthorized: false,
			requestCert: false,
			agent: false,
			json : {hw_id: datas[0], msg: datas[1], ts: datas[2]}
		};
		//console.log(options);
		request.post(options,
			function(error,response, body){
				//console.log(error);
				//console.log(body);
			}
		);
	}	  
  }
  else if(datas[0]=="TS"){
	//console.log(formatted)
	//console.log("Send timestamp");
	var options = {
		url: 'https://188.166.235.223:55555/timestamp',
		rejectUnauthorized: false,
		requestCert: false,
		agent: false,
	};
	request.get(options,
		function(error,response, body){
			port.write(body + "!");
		}
	);
  }
});
