\c nc_news

-- SELECT * FROM users;
-- SELECT * FROM topics;
-- SELECT * FROM articles;
-- SELECT * FROM comments;

SELECT articles.article_id, articles.title, articles.body, articles.votes, articles.topic, articles.author, articles.created_at, COUNT(comments.comment_id) AS comments_count
FROM articles 
LEFT JOIN comments 
ON articles.article_id = comments.article_id
GROUP BY articles.article_id;

