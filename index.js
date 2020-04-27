var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res) {
    res.sendFile(__dirname + "/html/control.html");
});
app.get('/st',function(req,res) {
    res.sendFile(__dirname + "/html/st.html");
})
app.get('/z',function(req,res) {
    res.sendFile(__dirname + "/html/zayavka.html");
})
app.listen(3000);