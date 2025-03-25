import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import articles from './article-content';
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import NotFoundPage from "./NotFoundPage";
import useUser from "../hooks/useUser";

export default function ArticlePage() {
    const { articleInfo, setArticleInfo } = useState({ upVotes: 0, comments: [], canUpVote: false });
    const { canUpVote } = articleInfo;
    const { articleId } = useParams();

    const { user, isLoading } = useUser();

    useEffect(() => {
        const fetchArticle = async () => {
            const token = user && await user.getIdToken();
            const headers = token ? { authToken: token } : {};
            const response = await fetch(`/api/articles/${articleId}`, { headers });
            const articleData = response.data;
            setArticleInfo(articleData);
        }

        if (!isLoading) {
            fetchArticle();
        }
    }
        , [isLoading, user]);

    const article = articles.find(article => article.name === name);

    async function addUpVote() {
        const token = user && await user.getIdToken();
        const headers = token ? { authToken: token } : {};
        const response = await fetch(`/api/articles/${articleId}/upvote`, {
            method: 'post',
            headers: headers
        });

        const updatedArticleData = response.data;
        setArticleInfo(updatedArticleData);
    }

    if (!article) {
        return <NotFoundPage />
    }

    return (
        <>
            <h1>{article.title}</h1>
            <div className="upvotes-section">
                {user ?
                    <button onClick={addUpVote}>{canUpVote} ? "Upvote": "Already upvoted"</button>
                    : <button>Log in to upvote</button>}
                <p>This article has {articleInfo.upVotes} upvote(s)</p>
            </div>
            {article.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
            ))}

            {user ?
                <AddCommentForm articleId={articleId}
                    onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} />
                : <button>Log in to add a comment</button>}
            <CommentsList comments={articleInfo.comments} />
        </>
    )
}