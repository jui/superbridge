// this sets the background color of the master UIView (when there are no windows/tab groups on it)
var TCP = require('com.digia.tcp');


Ti.include("soundbridge.js");

Titanium.UI.setBackgroundColor('#000');

//var sb = new SoundBridge("markus.homelinux.net",443);
//sb.connect();

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Tab 1',
    window:win1
});


var search = Titanium.UI.createSearchBar({
    barColor:'#000', 
    showCancel:true,
    height:43,
    top:0,
});

search.addEventListener("return",function() {
    sb.searchAll(search.value);
});

var tableView = Titanium.UI.createTableView({
						top: 45,
						separatorColor: "#AAA",
						left: 0,
						right: 0,
						bottom: 45,
						backgroundColor: "#BBB"
					    });

var volumeSlider = Titanium.UI.createSlider({
						max: 100,
						min: 0,
						value: 0,
						bottom: 8,
						left: 3,
						right: 3
					    });



win1.add(search);
win1.add(tableView);
win1.add(volumeSlider);


//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'Tab 2',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Tab 2',
    window:win2
});

var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 2',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win2.add(label2);



//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  


// open tab group
tabGroup.open();


var a = TCP.createExample({hostName: "mountain.homelinux.net", port: "443"});
a.addEventListener("read",function(e) {
		       Ti.API.info("###### TULI DATA ##### "+JSON.stringify(e));
		       search.value = e['data'];
		   });
a.connect();

a.write("SetVolume 10\n");
a.write("SetVolume 10\n");
a.write("SetVolume 10\n");

