let users = [
    {
        id: 1,
        username: "ali",
        followers: [2, 3, 4],
        following: [2, 5],
        posts: [
            {
                id: 101,
                text: "Hello World",
                likes: [2, 3],
                comments: [
                    { userId: 2, text: "Nice post!" }
                ]
            }
        ]
    },
    {
        id: 2,
        username: "ahmed",
        followers: [1],
        following: [1, 3, 4],
        posts: [
            {
                id: 102,
                text: "JavaScript is great!",
                likes: [1, 3, 4],
                comments: [
                    { userId: 1, text: "Great!" },
                    { userId: 3, text: "Yes!" }
                ]
            }
        ]
    },
    {
        id: 3,
        username: "usman",
        followers: [1, 2],
        following: [4],
        posts: []
    },
    {
        id: 4,
        username: "hassan",
        followers: [1, 2],
        following: [],
        posts: []
    },
    {
        id: 5,
        username: "danish",
        followers: [1],
        following: [1],
        posts: []
    }
];

function findUser(userId) {
    return users.find(user => user.id === userId);
}

function findPost(postId) {
    for (const user of users) {
        const post = user.posts.find(post => post.id === postId);
        if (post) return { user, post };
    }

    return null;
}

function followUser(userId, targetId) {
    const user = findUser(userId);
    const target = findUser(targetId);

    if (!user || !target) return "User not found.";
    if (userId === targetId) return "Cannot follow yourself.";
    if (user.following.includes(targetId)) return "Already following.";

    user.following.push(targetId);
    target.followers.push(userId);

    return "Followed successfully.";
}

function unfollowUser(userId, targetId) {
    const user = findUser(userId);
    const target = findUser(targetId);

    if (!user || !target) return "User not found.";

    user.following = user.following.filter(id => id !== targetId);
    target.followers = target.followers.filter(id => id !== userId);

    return "Unfollowed successfully.";
}

function createPost(userId, text) {
    const user = findUser(userId);

    if (!user) return "User not found.";
    if (!text.trim()) return "Post cannot be empty.";

    const allPosts = users.flatMap(user => user.posts);
    const newId = allPosts.length
        ? Math.max(...allPosts.map(post => post.id)) + 1
        : 101;

    user.posts.push({
        id: newId,
        text,
        likes: [],
        comments: []
    });

    return "Post created.";
}

function deletePost(userId, postId) {
    const user = findUser(userId);

    if (!user) return "User not found.";

    const postIndex = user.posts.findIndex(post => post.id === postId);

    if (postIndex === -1) return "Post not found.";

    user.posts.splice(postIndex, 1);
    return "Post deleted.";
}

function likePost(userId, postId) {
    const result = findPost(postId);
    const user = findUser(userId);

    if (!result || !user) return "User or post not found.";
    if (result.post.likes.includes(userId)) return "Already liked.";

    result.post.likes.push(userId);
    return "Post liked.";
}

function unlikePost(userId, postId) {
    const result = findPost(postId);

    if (!result) return "Post not found.";

    result.post.likes =
        result.post.likes.filter(id => id !== userId);

    return "Like removed.";
}

function commentPost(userId, postId, text) {
    const result = findPost(postId);
    const user = findUser(userId);

    if (!result || !user) return "User or post not found.";
    if (!text.trim()) return "Comment cannot be empty.";

    result.post.comments.push({
        userId,
        text
    });

    return "Comment added.";
}

function deleteComment(userId, postId, commentIndex) {
    const result = findPost(postId);

    if (!result) return "Post not found.";

    const comment = result.post.comments[commentIndex];

    if (!comment) return "Comment not found.";
    if (comment.userId !== userId) return "You can only delete your own comment.";

    result.post.comments.splice(commentIndex, 1);

    return "Comment deleted.";
}

function userWithMostFollowers() {
    return users.reduce((max, user) =>
        user.followers.length > max.followers.length ? user : max
    );
}

function userWithMostPosts() {
    return users.reduce((max, user) =>
        user.posts.length > max.posts.length ? user : max
    );
}

function mostLikedPost() {
    const posts = users.flatMap(user => user.posts);

    return posts.reduce((max, post) =>
        post.likes.length > max.likes.length ? post : max
    );
}

function mostCommentedPost() {
    const posts = users.flatMap(user => user.posts);

    return posts.reduce((max, post) =>
        post.comments.length > max.comments.length ? post : max
    );
}

function mostActiveUser() {
    return users.reduce((max, user) => {
        const activity =
            user.posts.length +
            user.followers.length +
            user.following.length;

        const maxActivity =
            max.posts.length +
            max.followers.length +
            max.following.length;

        return activity > maxActivity ? user : max;
    });
}

function mutualFollowers(userId1, userId2) {
    const user1 = findUser(userId1);
    const user2 = findUser(userId2);

    if (!user1 || !user2) return [];

    return user1.followers.filter(id =>
        user2.followers.includes(id)
    );
}

function getSuggestedUsers(userId) {
    const user = findUser(userId);

    if (!user) return [];

    const suggestions = new Set();

    user.following.forEach(followedId => {
        const followedUser = findUser(followedId);

        if (!followedUser) return;

        followedUser.following.forEach(id => {
            if (id !== userId && !user.following.includes(id)) {
                suggestions.add(id);
            }
        });
    });

    return [...suggestions].map(id => findUser(id));
}
console.log(followUser(1, 3));
console.log(likePost(1, 102));
console.log(commentPost(1, 102, "Amazing post!"));
console.log("Most Followers:", userWithMostFollowers());
console.log("Most Posts:", userWithMostPosts());
console.log("Most Liked:", mostLikedPost());
console.log("Most Commented:", mostCommentedPost());
console.log("Most Active:", mostActiveUser());
console.log("Mutual Followers:", mutualFollowers(1, 2));
console.log("Suggestions for Ali:", getSuggestedUsers(1));
