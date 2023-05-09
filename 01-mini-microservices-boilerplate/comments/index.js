const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res)=> {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res)=> {
    console.log("recieved comment for post " + req.params.id);
    const commentId = randomBytes(4).toString('hex');
    const {content} = req.body;
    const postId = req.params.id;
    const comments = commentsByPostId[postId] || [];

    comments.push({
        commentId, 
        content,
        status:'pending'
    });

    commentsByPostId[postId] = comments;

    await axios.post('http://event-bus-srv:4005/events', {
        type:'CommentCreated',
        data: 
        {
            id: commentId,
            content,
            postId,
            status: 'pending'
        }
    });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    const {type, data} = req.body;
    if(type === 'CommentModerated')
    {
        const {postId, id, status, content } = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {return comment.commentId === id});
        comment.status = status;

        await axios.post('http://event-bus-srv:4005/events', {
            type:'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            },
        })
    }

    res.send({})
});

app.listen(4001, ()=>{
    console.log('Listening on 4001');
});