import { useState } from "react";
import axios from 'axios';

function PostCreate() {

    const [title, setTitle] = useState("");

    const handleTitleChange = (event)=>{
        setTitle(event.target.value);
    }

    const handleSubmit = async (event) =>{
        event.preventDefault();
        console.log(title);
        await axios.post('http://posts.com/posts/create',
            {title}
        );
        
        setTitle("");
    }

    return <div>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input className="form-control" onChange={handleTitleChange} value={title}/>
            </div>
            <button className="btn btn-primary">Submit</button>
        </form>
    </div>
}

export default PostCreate;