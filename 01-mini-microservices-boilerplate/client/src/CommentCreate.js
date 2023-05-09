import { useState } from "react";
import axios from 'axios';

function CommentCreate({postId}) {
    const [comment, setComment] = useState('');
    const handleCommentChange =(event) => {
        setComment(event.target.value);
    }

    const handleSubmit = async (event)=>{
        event.preventDefault();
        await axios.post(`http://posts.com/posts/${postId}/comments`, 
        {
            content: comment
        });

        setComment('');
    }

    return <div>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>New comment</label>
                <input className="form-control" onChange={handleCommentChange} value={comment}/>
            </div>

            <button className="btn btn-primary">Submit</button>
        </form>
    </div>
}

export default CommentCreate;