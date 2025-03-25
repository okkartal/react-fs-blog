import fs from 'fs';
import admin from 'firebase-admin';
import express from 'express';
import { db, connectToDb } from './db.js';
 
const credentials = JSON.parse(fs.readFileSync('./credentials.json'));
admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());
 
const authMiddleware = async (req, res, next) => {
    const { authToken } = req.headers;

    if (authToken) {
        try {
            req.user = await admin.auth().verifyIdToken(authToken);
        } catch (e) {
            return res.sendStatus(400);
        }
    }
    req.user = req.user || null;
    next();
}

app.use(authMiddleware);

// Makale alma
app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    const article = await db.collection('articles').findOne({ name });

    if (article) {
        const upvoteIds = article.upvoteIds || [];
        article.canUpVote = req.user?.uid && !upvoteIds.includes(req.user.uid);
        res.json(article);
    } else {
        res.sendStatus(404);
    }
});

// Yetkilendirme kontrolü Middleware
const checkAuth = (req, res, next) => {
    if (req.user) {
        return next();
    }
    res.sendStatus(401);
};

app.use(checkAuth);
 
app.post('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        const upvoteIds = article.upvoteIds || [];

        if (uid && !upvoteIds.includes(uid)) {
            await db.collection('articles').updateOne(
                { name },
                {
                    $inc: { upvotes: 1 },
                    $addToSet: { upvoteIds: uid },
                }
            );
        }
 
        const updatedArticle = await db.collection('articles').findOne({ name });
        res.json(updatedArticle);
    } else {
        res.send('That article does not exist');
    }
});
 
app.post('/api/articles', async (req, res) => {
    const { name, upvotes = 0, comments = [] } = req.body;

    const article = {
        name,
        upvotes,
        upvoteIds: [],
        comments,
    };

    await db.collection('articles').insertOne(article);
    res.status(201).send();
});
 
app.post('/api/articles/:name/comment', async (req, res) => {
    const { text } = req.body;
    const { name } = req.params;
    const { email } = req.user;

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        await db.collection('articles').updateOne(
            { name },
            {
                '$push': {
                    comments: { postedBy: email, text },
                },
            }
        );

        const updatedArticle = await db.collection('articles').findOne({ name });
        res.json(updatedArticle);
    } else {
        res.send('That article does not exist');
    }
});
 
const PORT = process.env.PORT || 8000;
connectToDb(() => {
    console.log('Connected to DB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});