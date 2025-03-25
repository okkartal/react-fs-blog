export default function CommentsList({ comments }) {
    return (
        <>
            <h3>Comments:</h3>
            {comments.map((comment) => (
                <div key={comment.postedBy + ':' + comment.text}
                    className="comment">
                    <h4>{comment.postedBy}</h4>
                    <p>{comment.text}</p>
                </div>
            ))}
        </>
    )
}
