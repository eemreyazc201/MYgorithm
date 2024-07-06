import React, {useState, useEffect, useRef} from 'react';
import './Homepage.css';

import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { WagmiProvider } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { getPosts, createPost, likePost, unlikePost, isLiked } from "../contract-interface/interface";
import { PROJECT_ID } from '../config';

import axios from 'axios';
import uri from '../algorithm-cdis.json';

const queryClient = new QueryClient();
const config = getDefaultConfig({
  projectId: PROJECT_ID,
  chains: [ sepolia, mainnet ],
  ssr: true
});

export default function Homepage () {
  const [postText, setPostText] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [posts, setPosts] = useState([]);
  getPosts().then(post => {setPosts(post)});
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [postText]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={sepolia}>
            <div className="Homepage">
              <ConnectButton label="Sign in" accountStatus="avatar" chainStatus="icon" showBalance={true} />
              <div className="main">
                <div className="algorithms">
                  <p>algorithms1</p>
                  <p>algorithms2</p>
                  <p>algorithms3</p>
                  <p>algorithms4</p>
                  <p>algorithms5</p>
                  <p>algorithms6</p>
                </div>


                <button onClick={async () => {console.log(`https://agents.phala.network/ipfs/${uri.uri.substring("ipfs://".length)}`); 
                
                console.log((await axios.post("http://localhost:4000/algorithm", {
                  posts: await getPosts(),
                  agentURL: `https://agents.phala.network/ipfs/${uri.uri.substring("ipfs://".length)}`
                  }, {})));
                }}>Click It</button>




                <div className='divider'></div>
                <div className="posts">
                  {posts.map(post => (
                    <div key={parseInt(post.id._hex, 16)} className="post">
                      <p>Author: {post.author}</p>
                      <p>{post.content}</p>
                      <div>
                        {post.hashtags.map(tag => (
                          <span key={tag} className="hashtag">#{tag}</span>
                        ))}
                      </div>
                      <button className="like-button" onClick={async () => {
                        if (await isLiked(parseInt(post.id._hex, 16))) {
                          await unlikePost(parseInt(post.id._hex, 16));
                        } else {
                          await likePost(parseInt(post.id._hex, 16));
                        }
                      }}>{`Like ${(post.like.length)}`}</button>
                    </div>
                  ))}
                </div>
                <div className='new-post'>
                  <textarea 
                    ref={textareaRef}
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="What's on your mind?"
                  />
                  <input 
                    type="text" 
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="Add hashtags"
                  />
                  <button onClick={async () => {
                    createPost(postText, hashtags.split(' ').map(tag => tag.startsWith(' #') ? tag.substring(1) : tag));
                    setPostText(''); setHashtags(''); setPosts(await getPosts());
                  }}>Post</button>
                </div>
              </div>
            </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}