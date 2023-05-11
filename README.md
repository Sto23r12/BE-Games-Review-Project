## Charlie's game review.

## .env Files.

create the two .env files. one named .env.development with 'PGDATABASE=nc_games' inside.
create another one named .env.test with 'PGDATABASE=nc_games_test' inside.

## Endpoints

The endpoints which are available are:

# /api/categories

Returns the description and slug of each category of games.

# /api/reviews

serves an array of all reviews.
accepted queries are: "category", "sort_by", "order".

returns with title(string), designer(string), owner(string), review_img_url(string), category(string), created_at(string), votes(number), comment_count(number).

# /api/comments

serves an array of all of the comments
accepted queries are: "votes", "order", "sort_by", "review_id", "author";

returns with body(string), votes(number), author(string), review_id(number),created_at(string).

# /api/users

serves an array of all users.
accepted queries are: "username", "sort_by", "order", "name", "avatar_url";

returns with username(string), name(string), avatar_url(string);
