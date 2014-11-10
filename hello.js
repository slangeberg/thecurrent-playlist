if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);

      //HTTP.call("GET", "http://www.thecurrent.org/playlist", function(result){
      //  console.log("result: ", result);
      //  $('.output').html('result: ' + result);
      //})

      return true;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    console.log("Meteor.startup() - isServer");

    try {
      var result = HTTP.call("GET", "http://www.thecurrent.org/playlist");
      if (result.statusCode == 200) {
        console.log("SUCCESS: ");
        console.log("content: " + result.content.substring(0, 1000) + "...")
     //   <article class="row song" id="song240294"> <div class="two columns songTime"> <a href="#song240294"><time datetime="2014-11-10">11:08</time></a> </div> <figure class="four columns mobile-one"> <a href="http://www.thecurrent.org/playlist/catalog/240294?from=current"><img class="album-art" src="http://a4.mzstatic.com/us/r30/Music4/v4/71/d0/7b/71d07b09-88a6-d4ce-10cd-c682ee33cb61/886444552653.100x100-75.jpg"></a> </figure> <div class="seven mobile-two columns"> <a href="http://www.thecurrent.org/playlist/catalog/240294?from=current"> <h5 class="title">My Silver Lining</h5> <h5 class="artist">First Aid Kit</h5> </a> <div class="rate5 star-rated">5</div> </div> <div class="three columns songActions mobile-one"> <ul> <li><a href="https://itunes.apple.com/us/album/my-silver-lining/id845312934?i=845313037&amp;uo=4&amp;at=10l9kY" target="_blank" class="itunes">iTunes</a></li> <li><a href="http://astore.amazon.com/current-20/search?node=68&amp;keywords=First%20Aid%20Kit+Stay%20Gold&amp;x=9&amp;yamp;=11&amp;preview=" target="_blank">Buy CD</a></li> <li><a href="http://www.thecurrent.org/listen/request/240294">Request</a></li> </ul> </div> </article>

        var content = JSON(result.content);
        console.log("content: ", content);

        var body = content.body;
        console.log("body: ", body);

      } else {
        console.error("Unable to fetch playlist.", result);
      }
    } catch(ex) {
      console.error("Unable to fetch playlist.", ex);
    }
  });
} 
