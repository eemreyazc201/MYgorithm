// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract main {
    uint256 private postCounter;
    constructor () { postCounter = 0;}

    struct post {
        uint256 id;
        string content;
        address author;
        address [] like;
        string [] hashtags;
    }

    post [] private posts;

    function createPost (string memory _content, string [] memory _hasthags) public {
        posts.push(post (postCounter, _content, msg.sender, new address [] (0), _hasthags));
        postCounter += 1;
    }

    function likePost (uint256 _id) public {
        posts[_id].like.push(msg.sender);
    }

    function unlikePost (uint256 _id) public {
        for (uint i = 0; i < posts[_id].like.length - 1; i++) {
            if (posts[_id].like[i] == msg.sender) {
                posts[_id].like[i] = posts[_id].like[posts[_id].like.length - 1];
                break;
            }
        }

        posts[_id].like.pop();
    }

    function isLiked (uint256 _id) public view returns (bool) {
        for (uint i = 0; i < posts[_id].like.length; i++) {
            if (posts[_id].like[i] == msg.sender) {
                return true;
            }
        }

        return false;
    }

    function getLikeCount (uint256 _id) public view returns (uint256) {
        return posts[_id].like.length;
    }

    function getPost (uint256 _id) public view returns (post memory) {
        return posts[_id];
    }

    function getPostCounter () public view returns (uint256) {
        return postCounter;
    }
}    