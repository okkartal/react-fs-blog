import { useState } from "react";
import { useParams, useLoaderData } from "react-router-dom";
import articles from '../article-content';
import CommentsList from "../CommentsList";

export default function ArticlePage() {
    const { name } = useParams();
    const { upVotes: initialUpVotes, comments: initialComments } = useLoaderData();
    const [upVotes, setUpVotes] = useState(initialUpVotes);
    const [comments, setComments] = useState(initialComments);

    const article = articles.find(article => article.name === name);

    async function upVoteClicked() {
        const response = await fetch(`${import.meta.env.SERVER_URI}/api/articles/${name}/upvote`, {
            method: 'post',
        });

        const updatedArticleData = response.data;
        setUpVotes(updatedArticleData.upVotes);
    }

    async function onAddComment({ nameText, commentText }) {
        const response = await fetch(`/api/articles/${name}/comments`, {
            method: 'post',
            body: JSON.stringify({ postedBy: nameText, text: commentText }),
        });

        const updatedArticleData = response.data;
        setComments(updatedArticleData.comments);
    }

    return (
        <>
            <h1>{article.title}</h1>
            <p>{article.content}</p>
            <p>This post has been upvoted {upVotes} times</p>
            <button onClick={upVoteClicked}>Upvote</button>
            <h3>Comments:</h3>
            {comments.map((comment, key) => (
                <div key={key}>
                    <h4>{comment.postedBy}</h4>
                    <p>{comment.text}</p>
                </div>
            ))}
            <AddCommentForm onAddComment={onAddComment} />
            <CommentsList comments={comments} />
        </>
    )
}

export async function loader({ params }) {
    const response = await fetch(`${import.meta.env.SERVER_URI}/api/articles/${params.name}`);
    const { upvotes, comments } = response.data;
    return { upvotes, comments };
}