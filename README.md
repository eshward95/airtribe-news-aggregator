# airtribe-news-aggregator 📰

- Users can register, log in, and set their news preferences using the API.
- The API fetches news articles from multiple sources using external news APIs (Here, NewsAPI).
- The fetched articles are processed and filtered __asynchronously__ based on user preferences and are cached to reduce the number of API calls.
- The __LRU algorithm__ is used to manage the cache and ensure that the most frequently accessed articles are stored.
- The cache is periodically updated using a cron job that calls the news API every __20 minutes__.
- User authentication and route protection are implemented using __JWT tokens__.
- __Input validation__ is performed for user sign-in, login, and preference updates.
- Proper error handling is implemented for invalid requests and authentication errors.
- A __rate limiter__ is implemented using __IP addresses__, allowing only 10 requests to be made in 2 seconds.

Overall, this API provides a secure and efficient way for users to fetch news articles based on their preferences while minimizing the number of API calls and protecting against unauthorized access.

## Installation

To run application, you'll need to have Node.js installed on your machine.

1. Clone the repository: `git clone https://github.com/eshward95/airtribe-news-aggregator.git`
2. Install the dependencies: `npm install`
3. Start the server: `node src/server.js`

The application should now be running at [http://localhost:3001](http://localhost:3001).

## Running the Tests
```JS
npm test
```

## Usage

To use application, you can navigate to [http://localhost:3001](http://localhost:3001) in your web browser.
We are using a in-memory DB which is created inside the dev-deta folder and and `users.json` file is created

The application allows you to perform the following operations:

- Register a new user by sending a `POST request` to `/register` with a JSON body  containing the `user's email`, and `password`. The password will be hashed using __bcrypt__ before being stored in the `users.json` file.
- Log in the user by sending a POST request to `/login` with a JSON body containing the `user's email and password`. If the credentials are valid, a `JWT token` will be returned in the response.
- Update the user's news preferences by sending a `PUT` request to `/preferences` with the JWT token in the Authorization header and a JSON body containing the updated preferences.
- Fetch news articles based on the user's preferences by sending a `GET request` to /news with the JWT token in the Authorization header. The API will fetch news articles from multiple sources using the NewsAPI and filter them based on the user's preferences. The articles will be cached using the __`LRU algorithm`__ to reduce the number of API calls.
- Mark a news article as read or favorite by sending a POST request to `/news/:id/read` or `/news/:id/favorite` with the article ID in the URL parameter and the JWT token in the Authorization header.
- Get all read or favorite news articles by sending a `GET` request to `/news/read` or `/news/favorites` with the JWT token in the Authorization header.
- Search for news articles based on keywords by sending a GET request to `/news/search/:keyword` with the keyword in the URL parameter and the JWT token in the Authorization header.

## Folder Structure
- `controllers`: Contains separate controller files for handling different parts of the application logic:
  - `authController.js`: Handles user authentication and route protection, using JWT tokens and middleware functions to verify user credentials and protect certain routes.
  - `errorController.js`: Handles global error handling for the application, catching any unhandled errors and returning appropriate error messages to the client.
  - `newsController.js`: Handles all news-related actions, including fetching news articles based on user preferences and updating the news cache.
  - `userController.js`: Handles getting the user list, updating user preferences, and getting preferences for a specific user.
- `helpers`: Contains helper files and modules used by the controllers:
  - `apiHelper.js`: A wrapper for making Axios calls to third-party APIs.
  - `cron.js`: Calls the news API every 20 minutes to update the news cache.
  - `customError.js`: A custom error class that extends the `Error` class for handling application-specific errors.
  - `fileHelper.js`: Contains functions for performing file operations like reading and writing JSON files.
  - `getNewsHelper.js`: Contains functions for making GET API calls to third-party news sources.
  - `lruCache.js`: Implements the LRU algorithm for caching news articles and reducing the number of API calls.
  - `validationHelper.js`: Contains functions for checking basic validation in API responses.
- `routes`: Contains router files for different parts of the API:
  - `newsRouter.js`: Contains routes for fetching news articles and updating the news cache.
  - `userRouter.js`: Contains routes for getting the user list, updating user preferences, and getting preferences for a specific user.
- `validators`: Contains validation files using Express-validator for user sign-in, login, and preference validations.
- `dev.env`: Contains the environment variables for the news API key and simple JWT secret and expiration.
- `test.env`: Contains the testing environment variables for the news API key and simple JWT secret and expiration.
- `tests`: The tests folder contains automated tests for the application. The tests are organized into subfolders based on the component being tested: controllers, helpers, and routes.


## API Endpoints

- `POST /register`: Register a new user.
- `POST /login`: Log in a user.
- `GET /preference`: Retrieve the news preferences for the logged-in user.
- `PUT /preference`: Update the news preferences for the logged-in user.
- `GET /news`: Fetch news articles based on the logged-in user's preferences.
- `POST /news/:id/read`: Mark a news article as read.
- `POST /news/:id/favorite`: Mark a news article as a favorite.
- `GET /news/read`: Retrieve all read news articles.
- `GET /news/favorites`: Retrieve all favorite news articles.
- `GET /news/search/:keyword`: Search for news articles based on keywords.

API collection https://documenter.getpostman.com/view/18258117/2s93zE51MX


## Error Handling

The API implements proper error handling for invalid requests. If an invalid request is made, the API will return an error response with a status code and an error message.

## Input Validation

Input validation is implemented for user creation and preference updates. 
The allowed news preferences are "business", "entertainment", "general", "health", "science", "sports", and "technology". The following input validation rules are in place:

- Validation rules for user registration and login:
  - Name: Required
  - Email: Required, must be a valid email address.
  - Password: Required.

## Cache

- The cache is stored in the `cache.json` file.
- The cache uses the __LRU algorithm__ to manage the cache and ensure that the most frequently accessed articles are stored.
- The cache is updated periodically using a __cron__ job that calls the news API every 20 minutes.
- When a user requests news articles using the `/news` endpoint, the API first checks the cache to see if the requested articles are already stored.
- If the articles are in the cache and have not expired, the API returns the cached articles.
- If the articles are not in the cache or have expired, the API fetches the articles from the `external news API`, processes and filters them based on the user's preferences, and stores the articles in the cache.
- This ensures that the cached articles are up to date and reduces the number of API calls to the external news API.
- We can modify the cache expiration period in the `lruCache.js` file.

## Rate Limiting
- Rate limiting is implemented using a __fixed window counter algorithm__, where a count of the number of requests made by a given IP address is stored in a hash map.
- The hash map uses the IP address as the key and the count as the value.
- Every time a request is made, the count for the corresponding IP address is incremented.
- If the count exceeds the allowed limit, the request is rejected with a __429 Too Many Requests__ response.
- Here, the API allows a maximum of __10 requests__ to be made from a single IP address every __2 seconds__.
- Rate limiting also helps to prevent malicious attacks such as denial-of-service attacks that can overload the service and cause it to become unavailable.
- We can modify the max number of requests and timers in the `rateLimiter.js` file.

## Testing the API

To test the API, you can use a tool like Postman or cURL to send HTTP requests to the API endpoints

You can also test the cache by sending multiple requests to the `/news` endpoint and verifying that the API returns cached articles for subsequent requests within the cache expiration period. You can modify the cache expiration period,maximum size of the cache and other cache-related configurations in the `lruCache.js` file.



