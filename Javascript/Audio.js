var Audio =
{
    plugin : null
}

Audio.init = function()
{
    var success = true;
    
    this.plugin = document.getElementById("pluginAudio");
    
    if (!this.plugin)
    {
        success = false;
    }
    
	Audio.setMute(Audio.getMute()); //Setting mute w.r.t TV mute status before launching of app
    
	return success;
}

Audio.setRelativeVolume = function(delta)
{
    this.plugin.SetVolumeWithKey(delta);
    Display.setVolume( this.getVolume() );

}

Audio.getVolume = function()
{
    if (this.plugin.GetVolume() < 100)
		return this.plugin.GetVolume();
	else
		return 100;
}

Audio.setMute = function(state) 
{
    if(state == 1)
    {
        var volumeElement = document.getElementById("volumeInfo");
		var volElement = document.getElementById("vol");
		
        alert("Setting Mute to : "+state);
        this.plugin.SetUserMute(true);
        document.getElementById("volumeBar").style.backgroundImage = "url(Images/videoBox/muteBar.png)";
        document.getElementById("volumeIcon").style.backgroundImage = "url(Images/videoBox/mute.png)";
		document.getElementById("volInfo").style.backgroundImage = "url(Images/control/muteIcon.png)";
		
        widgetAPI.putInnerHTML(volumeElement, "MUTE");
		widgetAPI.putInnerHTML(volElement, "MUTE");
    }
    else
    {
        var volumeElement = document.getElementById("volumeInfo");
		
        alert("Setting Mute to : "+state);
        this.plugin.SetUserMute(false);
        document.getElementById("volumeBar").style.backgroundImage = "url(Images/videoBox/volumeBar.png)";
        document.getElementById("volumeIcon").style.backgroundImage = "url(Images/videoBox/volume.png)";
		document.getElementById("volInfo").style.backgroundImage = "url(Images/control/volIcon.png)";
		
        Display.setVolume(Audio.getVolume());
    }        
}

Audio.getMute = function() 
{
    var mutestate = this.plugin.GetUserMute();
    alert("Getting Mute Status : "+mutestate);
    return mutestate;
}

