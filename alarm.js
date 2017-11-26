//Config
var config = require('./config/config');

//request
var request = require('request');

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
  
	//notify user
	var options = {
		url: 'https://188.166.235.223:55555/trigger',
		rejectUnauthorized: false,
		requestCert: false,
		agent: false,
		json : {enc_msg: datas[1], IV: datas[0], usr: config.KEY}
	};
	//console.log(options);
	request.post(options,
		function(error,response, body){
			//console.log(error);
			//console.log(body);
		}
	);
  }
  
  //this loop grabs a token from the server. Although the naming convention is used as TIMESTAMP,
  //its actually not a timestamp. The naming convention wasnt changed for the sake of making minimum changes to the code. 
  else if(datas[0]=="TS"){
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
