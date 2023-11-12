CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    imageSrc VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    uuid_posts VARCHAR(255) NOT NULL,
    createUser VARCHAR(255) NOT NULL,
    createUserImageSrc VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    imageSrc VARCHAR(255)
);

CREATE TABLE comments (
    comment_id serial PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    userImageSrc VARCHAR(255) NOT NULL,
    uuid_comments VARCHAR(255) NOT NULL,
    comment_text TEXT NOT NULL
);

CREATE TABLE likes (
    likes_id serial PRIMARY KEY,
    uuid_likes VARCHAR(255) NOT NULL,
    likesname VARCHAR(255)
);

CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    uuid_messages VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_imagesrc VARCHAR(255) NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    receiver_imagesrc VARCHAR(255) NOT NULL,
    writemessage VARCHAR(255),
    writeimagesrc VARCHAR(255),
    content TEXT,
    dateandtime VARCHAR(255) NOT NULL
);