let express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser');

let route = require('./routes/contact-route');

let app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));

app.get('/', route.get);

app.get('/insert', route.getInsert);
app.post('/insert', route.postInsert);

app.get('/contact/:id', route.getContact);

app.get('/contact/:id/delete', route.getDelete);

app.get('/contact/:id/edit', route.getEdit);
app.post('/contact/:id/edit', route.postEdit);

http.createServer(app).listen(3000, () => {
    console.log('Express server 3000 포트에서 시작됨');
});