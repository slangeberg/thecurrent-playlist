if (Meteor.isClient) {
    Template.hello.helpers({
        playlist: function () {
            return Meteor.apply("playlist");
        }
    });
    Template.hello.events({
        'click button': function () {
            Meteor.call("playlist", function (err, result) {
                console.log("playlist: ", result)
                $(".output").html(result);
            });

            return true;
        }
    });
}

if (Meteor.isServer) {
    var cheerio = Meteor.npmRequire('cheerio');

    var playlist = function () {
        console.log("playlist()");

        $ = cheerio.load(Meteor.http.get("http://www.thecurrent.org/playlist").content);

        var list = [];
        var articles = $('.row.song'); //'''article');

        list = $('.row.song').map(function(i, el) {
            // this === el
            var title = $(this).find('.title');
            //console.log("title: ", title);

            return {title: title.text()};

        }).get();

        //console.log("list.len: ", list.length);

        return list;
    }

    Meteor.methods({
        playlist: playlist
    })

    Meteor.startup(function () {
        // code to run on server at startup
        console.log("Meteor.startup() - isServer");


    });
}

///////////////// Routes //////////////

Router.route('/', function () {
    this.render('hello');
});
Router.route('/api', {where: 'server'})
    .get(function () {
        /*
         this.response.statusCode = 200;
         this.response.setHeader("Content-Type", "application/json");
         this.response.setHeader("Access-Control-Allow-Origin", "*");
         this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
         if (this.request.method == 'GET') {
         // LIST
         Statistics.update({_id: "configuration"},{$inc:{
         total_count: 1,
         list_count: 1
         }});
         this.response.end(JSON.stringify(
         Posts.find().fetch()
         ));*/

        var list = Meteor.apply('playlist');

        console.log("/api - list.len: ", list.length);

        this.response.end(JSON.stringify(list));
    })
    .post(function () {
        this.response.end('post request\n');
    });