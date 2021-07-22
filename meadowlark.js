var express = require('express');
var fortune = require('./lib/fortune.js');
var app = express();

var fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
   ];

//(we call it public because anything in this directory will be served to the client without question
//you declare any routes, you’ll add the static middleware
app.use(express.static(__dirname + '/public'));

//set up handlebars view engine
var handlebars = require('express-handlebars').create({ defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
//creates a view engine and configures Express to use it by default.
app.set('view engine', 'handlebars');

//Note how we specify the port that we want our application to run on
//This allows us to override the port by setting an environment value before you start the server
app.set('port', process.env.PORT || 3000);

// use some middleware to detect test=1 in the querystring. It must
// appear before we define any routes in which we wish to use it
// app.use(function(req, res, next){
//     res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
//     next();
// });

app.get('/', function(req, res){
    res.render('home')
});

app.get('/about',function(req, res){
    //var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    //pass randome content there, then put into {{fortune}} in about.handlebars

    var randomFortune = fortune.getFortune();
    res.render('about', { fortune: randomFortune });
});

//Passing a context to a view, including querystring, cookie, and session values
app.get('/greeting', function(req, res){
    res.render('about', {
        message: 'welcome',
        style: req.query.style,
        userid: 'req.cookies.userid',
        username: 'req.session.username'
    });
});

// the following layout doesn't have a layout file, so views/no-layout.handlebars
// must include all necessary HTML
app.get('/no-layout',function(req, res){
    res.render('no-layout', { layout: null });
});

// Rendering a view with a custom layout (using files in folder layouts)
app.get('/custom-layout',function(req, res){
    res.render('custom-layout', { layout: 'custom'} );
});

//render plaintext output
app.get('/text', function(req, res){
    res.type('text/plain');
    res.send('this is text');
});

//simple get endpoint 
app.get('/api/tours',function(req, res){
    res.json(fortune.getTours())
});

// API that updates a tour and returns JSON; params are passed using querystring
app.put('/api/tour/:id', function(req, res){
    var p = fortune.getTours().some(function(p){
        return p.id == req.params.id
    });
    if(p) {
        if(req.query.name) p.name = req.query.name;
        if(req.query.price) p.price = req.query.price;
        res.json({success: true});
    }else{
        res.json({error: 'No suc tour exsits'});
    }
});

//custom 404 page
app.use(function(req, res){
    res.status(404);
    res.render('404')
});

//custom 500 page
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500')
}); 

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});