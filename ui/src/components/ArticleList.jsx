import { Link } from "react-router-dom";

export default function ArticleList({ articles }) {
    return (
        <>
        {articles.map((article =>
            <Link key={a.article} to={`/article/${article.name}`} className="article-list-item">
                <h3>{article.title}</h3>
                <p>{article.content[0].substring(0, 150)}...</p>
            </Link>
        ))}
        </>
    )
}
