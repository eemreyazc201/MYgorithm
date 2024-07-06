import { ethers } from 'ethers';

import ABI from '../contract-data/contract-abi.json';
import ADDRESS from '../contract-data/contract-address.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const contract = new ethers.Contract(ADDRESS.address, ABI.abi, signer);

export async function getPostCount () {
    return parseInt((await contract.getPostCounter())._hex, 16);
}

export async function getPosts () {
    let posts = [];
    const postCount = await getPostCount();
    for (let i = 0; i < postCount; i++) {
        const post = await contract.getPost(i);
        posts.push({
            id: i,
            content: post.content,
            author: post.author,
            like: post.like,
            hashtags: post.hashtags
        });
    }
    return posts;
}

export async function createPost (content, hashtags) {
    await contract.createPost(content, hashtags);
}

export async function likePost (postId) {
    await contract.likePost(postId);
}

export async function unlikePost (postId) {
    await contract.unlikePost(postId);
}

export async function isLiked (postId) {
    return await contract.isLiked(postId);
}

export async function getLikeCount (postId) {
    return parseInt((await contract.getLikeCount(postId))._hex, 16);
}

export async function likedPosts () {
    let likedPosts = [];
    const posts = await getPosts();

    for (let post of posts) {
        if (await isLiked(post.id)) {
            likedPosts.push(post);
        }
    }

    return likedPosts;
}