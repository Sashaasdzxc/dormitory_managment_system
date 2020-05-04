var express = require('express');
var mysql = require('mysql');
var app = express();
const bodyParser = require("body-parser");

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('view engine', 'hbs');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Dormitory'
});

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    connection.query("SELECT * FROM students",
        function (err, results, fields) {
            res.render('control', { users: results });
        });
    // connection.end();
});

app.post("/delete/:id", function (req, res) {
    const id = req.params.id;
    connection.query("SELECT * FROM students WHERE id=?", [id], function (err, result, fields) {
        //console.log(result);
        res.redirect("/");
    });
});

app.post("/", urlencodedParser, function (req, res) {
    var f_n = req.body.f_n;
    var s_n = req.body.s_n;
    var kv =req.body.kv;
    var f_n_q="1";
    var s_n_q ="1";
    if(f_n!=""){
        f_n_q="first_name='"+f_n+"'";
    }
    if(s_n!=""){
        f_n_q="second_name='"+s_n+"'";
    }
    connection.query("SELECT * FROM students WHERE "+f_n_q+" AND "+s_n_q, function (err, results, fields) {
        //console.log(result);
        res.render('control', { users: results });
    });
});

app.get('/st', function (req, res) {
    res.sendFile(__dirname + "/html/st.html");
})
app.get('/z', function (req, res) {
    res.sendFile(__dirname + "/html/zayavka.html");
})
app.listen(3000);