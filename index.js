var express = require('express');
var mysql = require('mysql');
var app = express();
const hbs = require("hbs");
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

class Room {
    constructor(numin, size, students, freeStatus){
        this.numin = numin;
        this.size = size;
        this.students = students;
        this.freeStatus = freeStatus;
    }
    refreshStatus(){
        this.freeStatus = (size === this.students.length()) ? false : true;
    }
    addStudent(id){
        this.refreshStatus();
        if (this.freeStatus) {
            this.students.push(id);
            this.refreshStatus();
        }
        else alert('Ошибка - в комнате нет свободных мест')
    }
    deleteStudent(id){
        let newstudents = [];
        let j = 0;
        for (let i = 0; i < this.students.length; i++) {
            if (id != this.students[i]) {
                newstudents[j] = this.students[i];
                j++;
            }
        }
        this.students = newstudents;
        this.refreshStatus();
    }
    getFreeNum(){
        return (size - this.students.length);
    }
}
class Flat {
    constructor(id, pod, numin, flatdata, freeStatus){
        this.id = id;
        this.pod = pod;
        this.numin = numin;
        this.flatdata = flatdata;
        this.freeStatus = freeStatus;
    }
    refreshStatus(){
        let freenum = 0;
        for (let i = 0; i < this.flatdata.length; i++) {
            if (this.flatdata[i].freeStatus) freenum++;
        }
        this.freeStatus = !(freenum === this.flatdata.length);
    }
}

function madeFreeList(results){
    var padiki = [];
    padiki[1] = [];
    padiki[2] = [];
    padiki[3] = [];
    padiki[4] = [];
    let roomtemp;
    for (let currentflatID = 0; currentflatID < results.length; currentflatID++) { //Выбираю квартиру и добавляю её в список если в ней есть хоть одно свободное место - отсеиваю полностью занятые квартиры
        if (results[currentflatID].isFree) { //Здесь пытаюсь переопределить все принимаемые данные в мои классы для использовани методов. Вполне возможно JS сам как-то умеет (с помощью одного метода, допустим) подгонять JSON или принимаемы объекты под классы, но я хз
            let rooms = []; //В итоге по-хорошему можно и без классов, так как они могут память жрать, но не думаю что очень и критично много. Если юзать мой flatengine, то классы помогут быстро что-то менять, так что штука полезная и убирать не стал
            let flatdatatemp = JSON.parse(results[currentflatID].flatdata);
            for (let currentroomID = 0; currentroomID < flatdatatemp.length; currentroomID++) { //Работаем непосредственно с комнатами
                if(flatdatatemp[currentroomID].freeStatus) {
                    roomtemp = new Room(flatdatatemp[currentroomID].numin, flatdatatemp[currentroomID].size, flatdatatemp[currentroomID].students, flatdatatemp[currentroomID].freeStatus)
                    rooms[roomtemp.numin] = roomtemp;
                }     
            }
            let flat = new Flat(results[currentflatID].id, results[currentflatID].pod, results[currentflatID].flat, rooms, results[currentflatID].isFree);
            padiki[results[currentflatID].pod].push(flat);
        }
    }
    return padiki;
}
hbs.registerHelper("frs", function(room, pod){
    var freespace = room.size - room.students.length;
    freepodid = "fp" + pod;
    return freespace;
});

app.set("view engine", "hbs");
app.get('/add', function (req, res) {
    connection.query("SELECT * FROM flats",
        function (err, results, fields) {
            res.render('addnewstudent2', { padiki: madeFreeList(results) });
        });
})

//Добавление квартиры
app.get('/addflat', function (req, res) {
    res.render('addflat', { wereDone: 0 });
})
app.post("/addflat", urlencodedParser, function (req, res) {
    console.log('Got req');
    console.log(req.body.podnum);
    console.log(req.body.flatnum);
    connection.query("SELECT * FROM flats WHERE flat='" + req.body.flatnum + "'", function (err, foremptyres, fields) {
        if (foremptyres.length == 0) {
            console.log(foremptyres);
            var flatdata = [];
            if (req.body.roomsize1) flatdata.push(new Room(1, req.body.roomsize1, [], 1));
            if (req.body.roomsize2) flatdata.push(new Room(2, req.body.roomsize2, [], 1));
            if (req.body.roomsize3) flatdata.push(new Room(3, req.body.roomsize3, [], 1));
            if (req.body.roomsize4) flatdata.push(new Room(4, req.body.roomsize4, [], 1));
            if (req.body.roomsize5) flatdata.push(new Room(5, req.body.roomsize5, [], 1));
            if (req.body.roomsize6) flatdata.push(new Room(6, req.body.roomsize6, [], 1));
            if (req.body.roomsize7) flatdata.push(new Room(7, req.body.roomsize7, [], 1));
            if (req.body.roomsize8) flatdata.push(new Room(8, req.body.roomsize8, [], 1));
            if (req.body.roomsize9) flatdata.push(new Room(9, req.body.roomsize9, [], 1));
            if (req.body.roomsize10) flatdata.push(new Room(10, req.body.roomsize10, [], 1));
            connection.query("INSERT INTO `flats` (`id`, `pod`, `flat`, `flatdata`, `isFree`) VALUES (NULL, '" + req.body.podnum + "', '" + req.body.flatnum + "', '" + JSON.stringify(flatdata) + "','1')", function (err, results, fields) {
                if(err) res.render('addflat', { otherError: err });
                res.render('addflat', { wereDone: 1 });
            }); 
        }
        else res.render('addflat', { alreadyExists: 1 });         
    });
});
