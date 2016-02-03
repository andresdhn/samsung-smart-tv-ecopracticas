var social = { twitter : {REFRESH_TIME: 60000, NUM_OF_TWEETS: 2} };

social.Twitter = function(user, container, numOfTweets, refreshTime) {
	
	var twitter = this;
	this.user = user;
	this.container   = container   ? container   : "tweets";
	this.refreshTime = refreshTime ? refreshTime : social.twitter.REFRESH_TIME; 
	this.numOfTweets = numOfTweets ? numOfTweets : social.twitter.NUM_OF_TWEETS;
			 
	this.loadTweets = function() {
	
		$.ajax({
  			url     : "http://api.twitter.com/1/statuses/user_timeline.json?callback=?",
			dataType: "json",
			data    : { 
						screen_name: this.user,
						include_rts: true, 
						count: this.numOfTweets
					  },
  			success: function(data) {
		        	
		        	$("#"+twitter.container).empty();
		        	$("#"+twitter.container).append("<ul>");
		        	
		        	$(data).each(function(){ 
		        		tweet = this;
		        		
						html = "<li>" + tweet.text + "<strong>. "+ jQuery.timeago(new Date(tweet.created_at)) +"</strong></li>";
						
						$("#"+twitter.container).append(html);
	        		});
	        		
					$("#" + twitter.container).append("</ul>");
		            twitter.refreshTweets();
		            

	       }/*,
	       complete: function(jqXHR, textStatus){
	       		
	       		alert("textStatus****************************+"+textStatus);
	       		if (jqXHR.destroy) {
                    jqXHR.destroy();
                }    
	       }*/
		});

	  	return tweets;
	}
	
	this.refreshTweets = function() {
		
		setTimeout(function(){	twitter.loadTweets(); }, this.refreshTime);
	
	}
	
	this.imageLoading = function() {
		$("#tweets").empty(); 
		//$('#tweets').append('<img id="twitter-loader" src=\"images/loader.gif\" />');
	}

	twitter.imageLoading();
	twitter.loadTweets();
	
}


