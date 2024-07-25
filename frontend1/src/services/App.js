// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { login, register } from './services/auth';
import { createPost, getPosts } from './services/posts';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        socket.on('post', post => {
            setPosts(prevPosts => [...prevPosts, post]);
        });
    }, []);

    const handleRegister = async () => {
        await register(username, password);
    };

    const handleLogin = async () => {
        const response = await login(username, password);
        setToken(response.data.token);
        const postResponse = await getPosts(response.data.token);
        setPosts(postResponse.data);
    };

    const handlePost = async () => {
        const response = await createPost(content, token);
        socket.emit('post', response.data);
    };

    return (
        <div>
            <h1>Social Media Platform</h1>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
            <button onClick={handleLogin}>Login</button>
            <div>
                <input type="text" placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} />
                <button onClick={handlePost}>Post</button>
            </div>
            <div>
                {posts.map(post => (
                    <div key={post._id}>
                        <h3>{post.userId.username}</h3>
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
