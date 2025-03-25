import ArticleList from "../components/ArticleList";
import articles from "./article-content";

export default function ArticleListPage() {
    return (
        <>
        <h1>Articles</h1>
        <ArticleList articles={articles} />
        </>
    )
}