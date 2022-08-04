let contact = {};

let fs = require('fs'),
    ejs = require('ejs'),
    mysql = require('mysql');

let dbconn = mysql.createConnection({
    user: 'root',
    password: 'mirim',
    database: 'contactdb'
});

contact.get = (req, res) => {
    fs.readFile('./views/list.ejs', 'utf8', (err, data) => {
        dbconn.query('select * from contacttb order by name asc;', (err, results) => {
            if(err){
                console.log('db error', err);
            }else{
                res.send(ejs.render(data, {data:results}));
            }
        });
    });
}

contact.getInsert = (req, res) => {
    fs.readFile('./views/insert.ejs', 'utf8', (err, data) => {
        res.send(data);
    });
}

contact.postInsert = (req, res) => {
    let body = req.body;

    let email = body.email;
    email.trim();
    if(email == '') email = null;

    if (body.name == ""){
        res.send("<script>alert('이름을 입력해주세요.'); window.location.replace('/insert');</script>");
    }else if(body.number == ""){
        res.send("<script>alert('전화번호를 입력해주세요.'); window.location.replace('/insert');</script>");
    }else{
        dbconn.query('insert into contacttb (name, number, email) values(?, ?, ?)',
        [body.name, body.number, email], () => {
            res.redirect('/');
        }
    );
    }
}

contact.getContact = (req, res) => {
    fs.readFile('./views/contact.ejs', 'utf8', (err, data) => {
        dbconn.query('select * from contacttb where id = ?', [req.params.id],
        (err, result) => {
            res.send(ejs.render(data, {data:result[0]}));
        });
    });
}

contact.getDelete = (req, res) => {
    var id = req.params.id;
    dbconn.query('delete from contacttb where id=?', id, (err, results) => {
        if(err){
            console.log('db error', err);
        }else{
            res.redirect('/');
        }
    });
}

contact.getEdit = (req, res) => {
    fs.readFile('./views/edit.ejs', 'utf8', (err, data) => {
        dbconn.query('select * from contacttb where id = ?', [req.params.id],
        (err, result) => {
            res.send(ejs.render(data, {data:result[0]}));
        });
    });
}

contact.postEdit = (req, res) => {
    let email = req.body.email;
    email = email.trim();
    if(email == '') email = null;

    dbconn.query('update contacttb set name =?, number =?, email =? where id =?',
    [req.body.name, req.body.number, email, req.params.id],
    () => {
        res.redirect('/contact/' + req.params.id);
    });
}

module.exports = contact;