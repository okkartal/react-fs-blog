import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();

app.use(express.json());

let db;

async function connectToDB() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  db = client.db('myBlogDB');
}

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    const articleInfo = await db.collection('articles').findOne({ name });
    res.status(200).json(articleInfo);
});

app.post('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    const updatedArticle = await db.collection('articles').updateOne({ name }, {
        '$inc': {
            upvotes: 1,
        },
    });
    const updatedArticleInfo = await db.collection('articles').findOne({ name });
    res.status(200).json(updatedArticleInfo);
});

app.post('/api/articles', async (req, res) => {
    const { name, upvotes, comment } = req.body;
    const article = {
        name,
        upvotes,
        comment,
    };
    await db.collection('articles').insertOne(article);
    res.status(201).send();
});

app.post('/api/articles/:name/add-comment', async (req, res) => {
    const { postedBy, text } = req.body;
    const { name } = req.params;
    const newComment = { postedBy, text };
    await db.collection('articles').updateOne({ name }, {
        '$push': {
            comments: newComment,
        },
    });
    const updatedArticleInfo = await db.collection('articles').findOne({ name });
    res.status(200).json(updatedArticleInfo);
});

async function start() {
    await connectToDB();
    app.listen(8000, () => console.log('Server is listening on port 8000'));
}

start();