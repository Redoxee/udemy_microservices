import axios from 'axios';
import { useState, useEffect } from 'react';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

function PostList() {
    const [posts, setPost] = useState({});

    const fetchPost = async ()=> {
        const res = await axios.get('http://posts.com/posts');

        setPost(res.data);
    };

    useEffect(()=>{
        fetchPost();
    }, []);

    const renderedPosts = Object.values(posts).map((post)=>{
        return <div key={post.id} className="card" style={{width: '30%', marginBottom: '20px'}}>
            <div className='card-body'>
                <h3>
                    {post.title}
                </h3>

                <CommentList comments={post.comments} />
                <CommentCreate postId={post.id} />
            </div>
        </div>
    });

    return <div className='d-flex flex-row flex-wrap justify-content-between'>
        {renderedPosts}
    </div>
}

export default PostList;