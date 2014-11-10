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
      }
    } catch(ex) {
      console.error("Unable to fetch playlist. ex: ", ex);
    }
  });
} 
