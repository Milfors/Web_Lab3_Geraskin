const { json, text } = require("body-parser");
const file = require('./Animals.json')
const fs = require('fs');
const { loadavg } = require("os");


const router = app => {
    app.get('/', (request, response) => {
        response.send({
            message: 'Node.js and Express REST API'
        });
    });
    app.get('/animals', (request, response) => {
        response.send(file);        
        console.log(file);
    });
    app.get('/home', (request, response) => {
        response.sendFile(__dirname + '/HTML/index.html', 'utf8');
    });

    app.get('/search', (request, response) => {
        response.send(file);
        console.log(file);
    });

    app.get('/search/:id', (request, response) => {
        try
        {
            var index = file.data.findIndex(i => i.id == request.params.id);
            if(index == -1)
            {
                var resp = {data:[]};
                response.status(200).send(resp);
                return;
            }
            var resp = {data:[file.data[index]]};
            response.status(200).send(resp);
        }
        catch
        {
            response.status(400).send("er");
        }
    });
    app.post('/search', (request, response) => {
            try
            {
                var item = {id:parseInt(request.body.id), name:request.body.name, animal:request.body.animal, color:request.body.color,  gender:request.body.gender, img:request.body.img};
                if(file.data.findIndex(i => i.id == item.id) != -1)
                {
                    response.status(400).send("id already exists");
                    return;
                }
                file.data.push(item);    
                pushToJson();
                response.status(201).send('User added');
            }
            catch
            {
                response.send("error");
            }
        });
    
        app.put('/search/:id', (request, response) => {
            try
            {
                var item = {id:parseInt(request.body.id), name:request.body.name, animal:request.body.animal, color:request.body.color, gender:request.body.gender,img:request.body.img};
                var id = parseInt(request.params.id);
                var index = file.data.findIndex(i => i.id == id);
                if(index == -1)
                {
                    response.status(400).send("id not founded");
                    return;
                }
                file.data[file.data.findIndex(i => i.id == id)] = item;
                pushToJson();
                response.send("PUT ok");
            }
            catch
            {
                response.send("error");
            }
        });
    
        app.delete('/search/:id', (request, response) => {
            try
            {
                var id = parseInt(request.params.id);
                var index = file.data.findIndex(i => i.id == id);
                if(index == -1)
                {
                    response.status(400).send("id not founded");
                    return;
                }
                file.data.splice(index,1);
                pushToJson();
                response.send("DELETE ok");
            }
            catch
            {
                response.send("error");
            }
        });
}






module.exports = router;


function pushToJson ()
{
    fs.writeFile('./routes/Animals2.json', JSON.stringify(file), function(err) {
        if (err) {
        console.log(err);
        }
    });
}