function CommentList({comments}) {
    const renderedComments = comments.map((comment) => {
        let content;
        if(comment.status === 'approved') {
            content = comment.content;
        }
        else if (comment.status === 'pending')
        {
            content = 'Comment awaiting moderation : ' + comment.content;
        }
        else if (comment.status === 'rejected')
        {
            content = 'Comment rejected : ' + comment.content;
        }

        return <li key={comment.id}>{content}</li>
    });

    return <div>
        {renderedComments}
    </div>
}

export default CommentList;