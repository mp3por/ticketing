const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];

    comments.push({
        id:commentId,
        content,
        status: 'pending'
    })

    commentsByPostId[req.params.id] = comments;

    const event = {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    };

    // query service
    await axios.post('http://localhost:4005/events', event);

    // moderation service
    await axios.post('http://localhost:4003/events', event);

    res.status(201).send(comments);
});

app.post('/events', async (req, res)=> {
    console.log('Received Event: ', req.body.type);

    const { type, data } = req.data;

    if (type === "CommentModerated") {
        const {postId, id, status, content } = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => comment.id === id);
        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        })
    }

    res.send({});
})

app.listen(4001, ()=>{
    console.log('Listening on 4001');
})