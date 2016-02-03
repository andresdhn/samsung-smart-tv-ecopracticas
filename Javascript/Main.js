var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var plugin = new Common.API.Plugin();
var loading;

var Main =
{
    selectedVideo : 0,
    mode : 0,
    mute : 0,
    
    UP : 0,
    DOWN : 1,

    WINDOW : 0,
    FULLSCREEN : 1,
    
    NMUTE : 0,
    YMUTE : 1
}

Main.onLoad = function() {
 	window.onshow = function(){ 
        plugin.registKey(TVKEY.KEY_INFOLINK);
    }	
	widgetAPI.sendReadyEvent();
}


$(document).ready( function() {

	/* Terms and Conditions file */
	var file = this.file = new Main.FileSystem("Eco_SamsungTerms_2012_02_10.txt");
	
	$("#samsung-terms").hide();
	
	if(file.read() == undefined) {
		file.write("rejected");
	}

	if(file.read() != undefined && file.read() != "rejected" && file.read() == "accepted") {
		/* Terms and Conditions were previously accepted, app deploy */
		Main.init();
		loading.show();

	} else if(file.read() == "rejected") {
		/* Terms and Conditions were'nt accepted yet, they are shown */
		Main.showTermOfConditions(file);
	}
});

Main.init = function()
{
	loading = new Main.LoadingIndicator();

	if ( Player.init() && Audio.init() && Display.init() && Server.init() )
	{
		Display.setVolume( Audio.getVolume() );
		Display.setTime(0);
		
		Player.stopCallback = function()
		{
			/* Return to windowed mode when video is stopped
				(by choice or when it reaches the end) */
			Main.setWindowMode();
		}

		// Start retrieving data from server
		Server.dataReceivedCallback = function()
			{
				/* Use video information when it has arrived */
				Display.setVideoList( Data.getVideoNames() );
				Main.updateCurrentVideo();
			}
		Server.fetchVideoList(); /* Request video information from server */
		
		// Twitter
		twitter = new social.Twitter("ecopracticas", "tweets", 4, 60000);
		
		//Publicidad
		new ads.BannerRotator({
			rssUrl: "http://www.samsung.com/ve/p2images/xml/ad_banners_eco.xml",
			container: $("#publicity"),
			fadeInterval: 500,
			interval: 20000
		}).start();
		
		
		// Enable key event processing
		this.enableKeys();

		widgetAPI.sendReadyEvent();    
		
	}
	else
	{
		alert("Failed to initialise");
	}

}

Main.onUnload = function()
{
    Player.deinit();
}

Main.updateCurrentVideo = function(move)
{
    Player.setVideoURL( Data.getVideoURL(this.selectedVideo) );
    
    Display.setVideoListPosition(this.selectedVideo, move);

    Display.setDescription( Data.getVideoDescription(this.selectedVideo));
	
	loading.hide();
}

Main.enableKeys = function()
{
    document.getElementById("anchor").focus();
}

Main.keyDown = function()
{
    var keyCode = event.keyCode;
    alert("Key pressed: " + keyCode);
    
	if ($("#contact").is(":hidden"))
	{
		switch(keyCode)
		{
			case tvKey.KEY_RETURN:
			case tvKey.KEY_PANEL_RETURN:
				alert("RETURN");
				this.handleReturnKey();
				widgetAPI.blockNavigation(event);
				break;    
		
			case tvKey.KEY_PLAY:
				alert("PLAY");
				this.handlePlayKey();
				break;
				
			case tvKey.KEY_STOP:
				alert("STOP");
				if (this.mode == this.FULLSCREEN) 
				{
					$("#stopIcon").animate({width: "90px" }, "fast");
					$("#stopIcon").fadeOut("fast");
				}
				Player.stopVideo();
				break;
				
			case tvKey.KEY_PAUSE:
				alert("PAUSE");
				this.handlePauseKey();
				break;
				
			case tvKey.KEY_FF:
				alert("FF");
				if(Player.getState() != Player.PAUSED)
					if (this.mode == this.FULLSCREEN) 
					{
						$("#ffIcon").animate({width: "90px" }, "fast");
						$("#ffIcon").fadeOut("fast");
					}
					Player.skipForwardVideo();
				break;
			
			case tvKey.KEY_RW:
				alert("RW");
				if(Player.getState() != Player.PAUSED)
					if (this.mode == this.FULLSCREEN) 
					{
						$("#rwIcon").animate({width: "90px" }, "fast");
						$("#rwIcon").fadeOut("fast");
					}
					Player.skipBackwardVideo();
				break;

			case tvKey.KEY_VOL_UP:
			case tvKey.KEY_PANEL_VOL_UP:
				alert("VOL_UP");
				if(Audio.getMute() == true) 
				{
					Audio.setMute(false);
				}
				Audio.setRelativeVolume(0);
				if (this.mode == this.FULLSCREEN) 
				{
					$("#volInfo").show();
					$("#volInfo").fadeOut("slow");
				}
				break;
				
			case tvKey.KEY_VOL_DOWN:
			case tvKey.KEY_PANEL_VOL_DOWN:
				alert("VOL_DOWN");
				if(Audio.getMute() == true) 
				{
					Audio.setMute(false);
				}
				Audio.setRelativeVolume(1);
				if (this.mode == this.FULLSCREEN) 
				{
					$("#volInfo").show();
					$("#volInfo").fadeOut("slow");
				}
				break;   

			case tvKey.KEY_DOWN:
				alert("DOWN");
				if ($("#main").is(":visible")) {
					this.selectNextVideo(this.DOWN);
				}
				break;
				
			case tvKey.KEY_UP:
				alert("UP");
				if ($("#main").is(":visible")) {
					this.selectPreviousVideo(this.UP);
				}
				break;            

			case tvKey.KEY_ENTER:
			case tvKey.KEY_PANEL_ENTER:
				alert("ENTER");
				this.toggleMode();
				break;
			
			case tvKey.KEY_MUTE:
				alert("MUTE");
				Audio.setMute(!Audio.getMute());
				if (this.mode == this.FULLSCREEN) 
				{
					$("#volInfo").show();
					$("#volInfo").fadeOut("slow");
				}
				break;
			
			case tvKey.KEY_EXIT:
				widgetAPI.sendExitEvent();
				break;
				
			case tvKey.KEY_BLUE:
				alert("BLUE");
				if ($("#main").is(":visible")) {
					this.Contact();
				}
				break;
				
			default:
				alert("Unhandled key");
				break;
		}
	}else if ($("#contact").is(":visible") && $("#main").is(":hidden")) {
		switch(keyCode)
		{
			case tvKey.KEY_BLUE:
				alert("BLUE");
				this.Contact();
				break;
			
			case tvKey.KEY_EXIT:
				widgetAPI.sendExitEvent();
				break;
			
			case tvKey.KEY_RETURN:
			case tvKey.KEY_PANEL_RETURN:
				alert("RETURN 2");
				widgetAPI.blockNavigation(event);
				this.Contact();
				break;    
				
			default:
				alert("Unhandled key");
				break;
		}
	}
}

Main.handleReturnKey = function()
{
	switch ( Player.getState() )
    {
		case Player.PLAYING:
			switch (this.mode)
			{
				case this.FULLSCREEN:
					this.setWindowMode();
					break;
			
				case this.WINDOW:
					Player.stopVideo();
					break;
			
				default:
					alert("ERROR: unexpected mode in toggleMode");
					break;
			}
			break;
			
        case Player.PAUSED:
            Player.stopVideo();
            break;

		case Player.STOPPED:
            widgetAPI.sendReturnEvent(); 
            break;
            
        default:
            alert("Ignoring Return key, not in correct state");
            break;
    }
	
}

Main.handlePlayKey = function()
{
	if (this.mode == this.FULLSCREEN) 
	{
		$("#playIcon").animate({width: "90px" }, "fast");
		$("#playIcon").fadeOut("fast");
	}
    switch ( Player.getState() )
    {
        case Player.STOPPED:
            Player.playVideo();
            break;
            
        case Player.PAUSED:
            Player.resumeVideo();
            break;
            
        default:
            alert("Ignoring play key, not in correct state");
            break;
    }
}

Main.handlePauseKey = function()
{
    switch ( Player.getState() )
    {
        case Player.PLAYING:
			if (this.mode == this.FULLSCREEN) 
			{
				$("#pauseIcon").animate({width: "90px" }, "fast");
				$("#pauseIcon").fadeOut("fast");
			}
            Player.pauseVideo();
            break;
        
        default:
            alert("Ignoring pause key, not in correct state");
            break;
    }
}

Main.selectNextVideo = function(down)
{
	if (Data.getVideoCount() > 0) {
	
		Player.stopVideo();
    
		this.selectedVideo = (this.selectedVideo + 1) % Data.getVideoCount();

		this.updateCurrentVideo(down);
	}
}

Main.selectPreviousVideo = function(up)
{
    if (Data.getVideoCount() > 0) {
	
		Player.stopVideo();
		
		if (--this.selectedVideo < 0)
		{
			this.selectedVideo += Data.getVideoCount();
		}

		this.updateCurrentVideo(up);
	}
}

Main.setFullScreenMode = function()
{
    if (this.mode != this.FULLSCREEN)
    {
        Display.hide();
        Player.setFullscreen();
		document.getElementById("loading-indicator").style.left = "440px"; 
		document.getElementById("loading-indicator").style.top = "220px";         
        this.mode = this.FULLSCREEN;
    }
}

Main.setWindowMode = function()
{
    if (this.mode != this.WINDOW)
    {
		alert("setwindowmode");
        Player.setWindow();
		Display.show();
		document.getElementById("loading-indicator").style.left = "650px";
		document.getElementById("loading-indicator").style.top = "180px"; 
        this.mode = this.WINDOW;
    }
}

Main.toggleMode = function()
{
    if(Player.getState() == Player.PAUSED)
    {
		Player.resumeVideo();
	}
	if(Player.getState() == Player.STOPPED)
	{
		alert("Ignoring toggle Mode, not in correct state");
	}
	else 
	{
		switch (this.mode)
		{
			case this.WINDOW:
				this.setFullScreenMode();
				break;
				
			case this.FULLSCREEN:
				this.setWindowMode();
				break;
				
			default:
				alert("ERROR: unexpected mode in toggleMode");
				break;
		}
	}
}


Main.Contact = function()
{
	switch ($("#main").is(":visible")) 
    {
        case true:
            Player.stopVideo();
			Display.hide();
			alert("hide");
			document.getElementById("contact").style.display="block";
			break;
			
		case false:
			Display.show();
			alert("show");
			document.getElementById("contact").style.display="none";
			break
			
        default:
			alert("ERROR: unexpected window mode");
            break;
    }
}

/*
 * creates a file in File System and provides 
 * funtionalities to write an read
 */
Main.FileSystem = function(fileName) {
	var Obj = this;
	var fileSystem = new FileSystem();

	this.write = function(str) {
		var fileObj = fileSystem.openCommonFile(fileName, "w");
		fileObj.writeAll(str);
		fileSystem.closeCommonFile(fileObj);
	}
	this.read = function() {
		if(fileSystem.openCommonFile(fileName, "r") != null) {
			var fileObj = fileSystem.openCommonFile(fileName, "r");
			var str = jQuery.trim(fileObj.readAll());
			fileSystem.closeCommonFile(str);
			return str;
		}
	}
}
/*  */

/*
 * Terms and contditions window
 */ 
Main.showTermOfConditions = function(file) {

	$("#samsung-terms").focus().eq(0).addClass("focus").show();
	
	$("#samsung-terms").focus().keydown( function(e) {

		switch(e.keyCode)
		{
		case tvKey.KEY_ENTER: 
			$("#samsung-terms").remove();
			file.write("accepted");
			Main.init();
			e.stopPropagation();
			break;
			
		case tvKey.KEY_RETURN:
			widgetAPI.sendExitEvent();
			break;
			
		case tvKey.KEY_EXIT:
			widgetAPI.sendExitEvent();
			break;
			
		}	
	});
}


/****************/
/* Manejo del indicador de carga para las llamadas a servicios Ajax*/
Main.LoadingIndicator = function() {
	
	var loadingIndicator = this;
	var imgName = "step_";
	var imgIndex = "01";
	var	ext = ".png";
	this.indexImages = 0;
	this.loadingImg = new Array();
	this.idInterval = 0;
	
	for ( i=0; i<12; i++) {
		if ( i <= 9 ) {
			imgIndex = (i);
		}
		else {
			imgIndex = i.toString();
		}
		loadingIndicator.loadingImg[i] = new Image();
		loadingIndicator.loadingImg[i].src = "Images/loading/" + imgName + imgIndex + ext;
	}
	
	$("#loading-indicator").attr("src", loadingIndicator.loadingImg[0].src);

	this.show = function() {
		$("#loading-indicator").show();
		loading.idInterval = window.setInterval("changeImage()", 100);
	}
	this.change = function() {
		$("#loading-indicator").attr("src", loadingIndicator.loadingImg[loadingIndicator.indexImages].src);
		loadingIndicator.indexImages = (loadingIndicator.indexImages == 11) ? 0 : (loadingIndicator.indexImages + 1);
	}
	this.hide = function() {
		$("#loading-indicator").hide();
		window.clearInterval(loading.idInterval);
	}	
}
changeImage = function(){
	loading.change();
}