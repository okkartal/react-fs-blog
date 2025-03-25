import { useState } from "react";
import useUser from "../hooks/useUser";

export default function AddCommentForm({ articleName, onArticleUpdated }) {
    const [name, setName] = useState('');
    const [commentText, setCommentText] = useState('');
    const { user } = useUser();

    const addComment = async () => {
        const token = user && await user.getIdToken();
        const headers = token ? { authToken: token } : {};
        const response = await fetch(`/api/articles/${articleName}/comments`, {
            postedBy: name,
            text: commentText
        }, { 
            method: 'POST',
            headers });

        const updatedArticle = response.data;
        onArticleUpdated(updatedArticle);
        setName('');
        setCommentText('');
    }

    return (
        <div>
            <h3>Add a Comment:</h3>
            {user && <p>You are posting as {user.email}</p>}
            <textarea
                rows="4"
                cols="50"
                value={commentText}
                onChange={e => setCommentText(e.target.value)} />
            <button onClick={() => { addComment }}>Add Comment</button>
        </div>
    )
}
