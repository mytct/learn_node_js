var express = require('express');
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

app.get('/', function(req, res){
    res.render('home')
});

app.get('/about',function(req, res){
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', { fortune: randomFortune });
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