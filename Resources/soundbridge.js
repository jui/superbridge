
var sb_callbacks = {};
var sb_callbacks_datalist = {};

String.prototype.startsWith = function(str) {
 return (this.match("^"+str)==str)
}


function SoundBridge(host,port)
{
    this.host = host;
    this.port = port;

    this.connect = function() {
    sb_callbacks["roku"] = function(data) {};
    this.socket = TCP.createExample({hostName: this.host, port: this.port});
    this.socket.addEventListener("read",function(e) {
            var cmd = e['data'].split(':')[0];
            var data = e['data'].split(": ");
            data.shift();
            if (typeof(sb_callbacks[cmd]) != "undefined") {
                sb_callbacks[cmd](data.join(': '),cmd);
            }
           });
    this.socket.connect();

    this.socket.addEventListener('readError', function(e){
//            this.socket.close();
             alert ('read error on websocket');
    });
 
    this.socket.addEventListener('writeError', function(e){
  //          this.close();
            alert ('read error on websocket');
    });
    };

    this.sendCommand = function(command, callback) {
    var cmd = command.split(" ")[0];
    sb_callbacks[cmd] = callback;
    this.socket.write(command+"\n");
    };

    this.sendListCommand = function(command, callback) {
    this.sendCommand(command, function(data,cmd) {
        if (data.startsWith("ListResultSize")) {
            // TODO
        } else if (data == "ListResultEnd") {
            callback(sb_callbacks_datalist[cmd]);
            sb_callbacks_datalist[cmd] = [];
        } else {
            if (typeof(sb_callbacks_datalist[cmd]) == "undefined") {
                sb_callbacks_datalist[cmd] = [];
            }
            sb_callbacks_datalist[cmd].push(data);
        }
        });
    };


    this.setVolume = function(volume) {
    this.socket.write("SetVolume "+volume+"\n");
    };
    this.getVolume = function(callback) {
    this.sendCommand("GetVolume", callback);
    };

    this.presets = function(callback) {
    this.sendListCommand("ListPresets",callback);
    };

    

    this.searchAll = function(query, callback) {
    this.sendListCommand("SearchAll "+query, callback);
    };
};
