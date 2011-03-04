
function SoundBridge(host,port)
{
    this.host = host;
    this.port = port;
    this.connect = function() {

	this.socket = Titanium.Network.createTCPSocket({
            hostName:this.host,
            port:this.port,
            mode:Titanium.Network.READ_WRITE_MODE
	});
 
 
	this.socket.addEventListener('read', function(e){
            Ti.API.error (e['from'] + ':' + e['data'].text);                    
	});
 
	this.socket.addEventListener('readError', function(e){
            this.close();
            alert ('read error on websocket');
	});
 
	this.socket.addEventListener('writeError', function(e){
            this.close();
            alert ('read error on websocket');
	});
 
	this.socket.connect();
    };

    this.searchAll = function(query) {
	this.socket.write("SearchAll "+query+"\n");
    };
};