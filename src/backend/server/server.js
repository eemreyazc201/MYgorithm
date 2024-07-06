const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;
const axios = require('axios');
const fs = require('fs');

app.use( express.json() );
app.use( cors() );

app.listen(port, () => {console.log(`Server is running on port ${port}.`);});

app.post('/algorithm', async (req, res) => {
    let posts = req.body.posts;
    data = [];
    for (let post of posts) {
        data.push({
            id: parseInt(post[0].hex, 16),
            content: post[1],
            author: post[2],
            like: post[3],
            hashtags: post[4]
        })
    }
    let agentURL = req.body.agentURL;

    axios.post(agentURL, {
        posts: data
    }, {}).then((response) => {
        return response.config.data;
    }).then(feed => {
        res.send(feed);
    }).catch((error) => {
        console.log(error);
    });
});    

app.post('/add-algorithm', async (req, res) => {
    let key = req.body.key;
    let value = req.body.value;
    let uris = req.body.uris;
    uris[key] = value;
    console.log(uris);

    fs.writeFile("D:/MYgorithm/src/frontend/uris.json", JSON.stringify(uris), (err) => {
        if (err) throw err;
        console.log("The file was succesfully saved!");
    });
});    