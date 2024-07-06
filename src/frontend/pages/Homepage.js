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
import uris from '../uris.json';

const queryClient = new QueryClient();
const config = getDefaultConfig({
  projectId: PROJECT_ID,
  chains: [ sepolia, mainnet ],
  ssr: true
});

export default function Homepage () {
  const [postText, setPostText] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [posts, setPosts] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    getPosts().then(post => {setPosts(post)});
  }, [postText]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={sepolia}>
            <div className="Homepage">
              <ConnectButton label="Sign in" accountStatus="avatar" chainStatus="icon" showBalance={true} />
              <div className="main">
                <section>

                  <div className="algorithms">{Object.entries(uris).map(([key, uri]) => (
                    <button key={key}>{key}</button>
                  ))}</div>
                  <input 
                      type="text" 
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="Algorithm Name"
                  />
                  <input 
                      type="text" 
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Algorithm URI"
                  />
                  <button onClick={async () => {
                    axios.post("http://localhost:4000/add-algorithm", {
                      key: key,
                      value: value,
                      uris: uris
                    },{})
                  }}>Add Algorithm</button>
                  


                  <button onClick={async () => {
                    // console.log(`https://agents.phala.network/ipfs/${uri.uri.substring("ipfs://".length)}`); 
                  
                    let feed = (await axios.post("http://localhost:4000/algorithm", {
                      posts: await getPosts(),
                      agentURL: `https://agents.phala.network/ipfs/${uri.uri.substring("ipfs://".length)}`
                      }, {})).data; 

                    console.log(feed);
                    setPosts(feed);

                  }}>Click It</button>

                </section>


                <div className='divider'></div>
                <div className="posts">
                  {posts.map(post => (
                    <div key={post.id} className="post">
                      <p>Author: {post.author}</p>
                      <p>{post.content}</p>
                      <div>
                        {post.hashtags.map(tag => (
                          <span key={tag} className="hashtag">{tag}</span>
                        ))}
                      </div>
                      <button className="like-button" onClick={async () => {
                        if (await isLiked(post.id)) {
                          await unlikePost(post.id);
                        } else {
                          await likePost(post.id);
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
                    setPostText(''); setHashtags(''); 
                    let feed = (await axios.post("http://localhost:4000/algorithm", {
                      posts: await getPosts(),
                      agentURL: `https://agents.phala.network/ipfs/${uri.uri.substring("ipfs://".length)}`
                      }, {})).data; 

                    setPosts(feed);
                  }}>Post</button>
                </div>
              </div>
            </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}