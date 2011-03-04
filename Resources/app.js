// this sets the background color of the master UIView (when there are no windows/tab groups on it)
var TCP = require('com.digia.tcp');


Ti.include("soundbridge.js");

Titanium.UI.setBackgroundColor('#000');

var sb = new SoundBridge("192.168.0.108","5555");
sb.connect();


// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Search',
    backgroundColor:'#fff',
    navBarHidden: false
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Search',
    window:win1
});


var search = Titanium.UI.createSearchBar({
    barColor:'#000', 
    showCancel:true,
    height:43,
    top:0,
});



var tableView = Titanium.UI.createTableView({
						top: 45,
						separatorColor: "#AAA",
						left: 0,
						right: 0,
						bottom: 45
					    });


search.addEventListener("return",function() {
    sb.searchAll(search.value,function(data) {
	var tableData = data.map(function(d) { return {'title': d};});
	tableView.setData(tableData);	
    });
});

tableView.addEventListener("click", function(e) {
	var idx = e["index"];
	sb.sendCommand("PlayIndex "+idx, function(data) {});
});

var volumeSlider = Titanium.UI.createSlider({
						max: 100,
						min: 0,
						value: 0,
						bottom: 8,
						left: 3,
						right: 3
					    });

sb.getVolume(function(data,cmd) {
	volumeSlider.value = parseInt(data);
	volumeSlider.addEventListener("change",function(e) {
		sb.setVolume(volumeSlider.value);	
	});
});




sb.presets(function(data) {
	Ti.API.info(JSON.stringify(data));
});

win1.add(search);
win1.add(tableView);
win1.add(volumeSlider);


//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'Presets',
    backgroundColor:'#fff',
    navBarHidden: false

});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Presets',
    window:win2
});


var presetTableView = Titanium.UI.createTableView({
						top: 0,
						separatorColor: "#AAA",
						left: 0,
						right: 0,
						bottom: 45
					    });

presetTableView.addEventListener("click",function(e) {
	var idx = e["index"];
	sb.sendCommand("PlayPreset "+idx, function(data) {});
});

win2.add(presetTableView);

sb.presets(function(data) {
	var tableData = data.map(function(d) { return {'title': d};});
	presetTableView.setData(tableData);
});




//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  


win1.addEventListener("android:volup", function(e) {
	volumeSlider.value = volumeSlider.value + 5;	
});
win1.addEventListener("android:voldown", function(e) {
	volumeSlider.value = volumeSlider.value - 5;	
});


// open tab group
var activity = Ti.Android.currentActivity;

activity.onCreateOptionsMenu = function(e) {
    var menu = e.menu;

    var pause = menu.add({ title: "Pause", itemId: PAUSE });
    pause.addEventListener("click", function(e) {
	sb.sendCommand("IrDispatchCommand CK_PAUSE",function(data) {});
    });

    var play = menu.add({ title: "Play", itemId: PLAY });
    play.addEventListener("click", function(e) {
	sb.sendCommand("IrDispatchCommand CK_PLAY",function(data) {});
    });

    var prev = menu.add({ title: "Previous", itemId: PREV });
    prev.addEventListener("click", function(e) {
	sb.sendCommand("IrDispatchCommand CK_NEXT",function(data) {});

    });

    var next = menu.add({ title: "Next", itemId: NEXT });
    next.addEventListener("click", function(e) {
	sb.sendCommand("IrDispatchCommand CK_PREVIOUS",function(data) {});

    });
 
};

//activity.onPrepareOptionsMenu = function(e) {
//    var menu = e.menu;
//};


tabGroup.open();



