# PK-NC-NEWS

## Overview 

This is a Reddit-like back end REST API, which can be accessed [here](https://pk-nc-news.herokuapp.com/api), created during the back end module on the [Northcoders](https://northcoders.com/) developer bootcamp. 

Endpoints currently supported:

```http
GET /api

GET /api/topics

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id
DELETE /api/articles/:article_id

GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments

GET /api/articles
POST /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

```
Endpoints coming shortly:

```http
POST /api/topics
POST /api/users
GET /api/users
```
See [endpoints.json](https://github.com/galambborong/pk-nc-news/blob/master/endpoints.json) or [the main API landing page](https://pk-nc-news.herokuapp.com/api) for a more detailed breakdown on available methods, including sample responses, submissions and queries.

## Technology stack

This API uses the 

- **Express** server framework in 
- **NodeJS**, coupled with a 
- **PostgreSQL** database
- **KnexJS** is used to interface between Node and PSQL in JavaScript

## Approach

The code handling requests and responses follows the **model-view-controller** (MVC) design pattern. Using Jest and Supertest, all development has been **test-driven** (TDD). 

## Acknowledgements

The first phase of this project [up to commit c6c1cbf](https://github.com/galambborong/pk-nc-news/commit/c6c1cbf1b61386febc2f14614ecc8af64172204e) was advanced through pair programming with [V98Ganz](https://github.com/V98Ganz). 

All commits prior to [commit 331d4e9](https://github.com/galambborong/pk-nc-news/commit/331d4e92392cb84c8024aa18622aa2a7770c7913) are by Northcoders tutors, establishing the starting scaffolding of the repository (sample data, for example).