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
        var articles = $('article.row.song'); //'article');

        list = $('.row.song').map(function(i, el) {
            // this === el
            var $el = $(el);
            var $time = $el.find('time');
            return {
                artist: $el.find('.artist').text(),
                title: $el.find('.title').text(),
                album_art: $el.find('.album-art').attr('src'),
                date: $time.attr('datetime'),
                time: $time.text()
            };

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

//--> Todo: Find existing discovery service?

        var api = {
            description: "REST API for thecurrent.org/playlist",
            links: [
                {
                    description: "Get latest playlist",
                    link: "/api/list"
                }
            ]
        }

        this.response.setHeader("Content-Type", "application/json");
        this.response.end(JSON.stringify(api));
    });
Router.route('/api/list', {where: 'server'})
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

        this.response.setHeader("Content-Type", "application/json");
        this.response.end(JSON.stringify(list));
    })
    .post(function () {
        this.response.end('post request\n');
    });