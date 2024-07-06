const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;
const axios = require('axios');

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