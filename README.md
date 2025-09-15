
# Chirpy

A Twitter/X API clone that provides several API features such as Creating Chirps (like Tweets but Chirps), Deleting Chirps, Getting Chirps, Logging into Chirpy, Creating API token, Refreshing Token, Revoking Token, Upgrading to Premium Account (Chirp Red), Performing a Server Healthcheck, and Getting Server Metric.

## Technologies Used:
- TypeScript
- Node.js
- Express.js
- PostgreSQL
- Drizzle ORM
- JWT

## Installation

To get started with this project, follow the below:
1. Clone the repository:
```
git clone https://github.com/tobib-dev/chirpy-ts.git
cd chirpy-ts
```

2. Install the dependencies:
``` npm install ```

3. Add environment variables. Make sure to set platform, JWT server token, and polka API key inorder to use features that require this variables:
``` cp .env.example .env ```

## Database Setup

This project uses PostgresSQL with Drizzle ORM.
1. Make sure you have PostgresSQL installed and setup, run the command for Mac:
```
curl -sS https://webi.sh/postgres | sh; \
source ~/.config/envman/PATH.env
```

For Linux:
```
curl -sS https://webi.sh/postgres | sh; \
source ~/.config/envman/PATH.env
```

2. Update DB_URL in the .evn file, see below for a sample URL:
```
DB_URL="postgresql://<username>:<password>@localhost:5432/chirpy?sslmode=disable"
```

3. Generate the drizzle schema:
```
npx drizzle-kit generate
```

4. Push schema changes to the database:
```
npx drizzle-kit migrate
```

## Running

To run the project, use the following command:
```
npm run dev
```
Open (http://localhost:3000) in your browser to see the app running.
**While you can open the app in your browser, this app is largely a backend API server, therefore the main interface for interacting with the app is through the CLI using cURL**

## Configuration

Set database url using the sample from the requirements section, set platform to *"dev"* as delete is only allowed in "dev", generate a JWT server token and assign it to the SERVER_TOKEN variable. POLKA_KEY is neccesary to upgrade membership to Chirpy Red, so make sure to set POLKA_KEY.

## Usage

Here are some sample usage of Chirpy

### Create User

You can create a user by making a POST request to the user endpoint like below:
**POST /api/users** with Request Body:
{
  "email": "example@email.com",
  "password": "0000"
}

Responds with a 201 status code and email, password isn't in response.

### Update User

Updating user requires passing user access token in authorization header
*Sample authorization header*
- Authorization: Bearer ${sampleAccessToken}

**PUT /api/users** with Request Body:
{
  "email": "example_new@email.com",
  password: "newPassw1d"
}

Responds with a 200 status code, similar to create password isn't included in response but email is.

### User Login

Login returns access token in the response body
**POST /api/login** with Request Body:
{
  "email": "example@email.com",
  "password": "0000"
}

Responds with a 200 status code and access token variable if access token is valid else responds with 401.

### Create Chirp

Pass access token into authorization header similar to update user request.
**POST /api/chirps** with Request body:
{
  "body": "Just setting up my chpy"
}

Responds with a 200 status code and body equals to the given chirp body if access token is valid else responds with a 401

### Get Chirps

There are several variation of get chirps:
1. Get all Chirps
2. Get chirps from a specific user
3. Get chirps by chirpID

To get all chirps simply make a GET request to the /api/chirps endpoint and you can get all chirps.
**GET /api/chirps**

To get chirps from a specific user you will have to provide an optional parameter of the author's id. **Note: If you don't provide the author's id then all chirps from the database will be returned in response body**
**GET /api/chirps?author_id=author_id**

To get chirps by the chirp id, simply include the chirp id in the request.
**GET /api/chirps/{chirpID}**

All three variation return a list of chirps and a 200 status code
**Note: You can also sort chirps based on the chirp created time, simply pass asc or desc into your request similar to how you will pass author id**
**GET /api/chirps?sort=asc**

### Delete Chirp

To delete chirp use Request
**DELETE /api/chirp/{chirpID}**

Delete returns a 204 status code if successful else 403 if user's access token doesn't match database. 404 if chirp is not found, 401 if token is not valid and 400 if the access token is malformed

### Upgrade Membership

To upgrade membership use Request
**POST /api/webhooks**

Upgrade returns a 204 if successful, 404 if user is not found. Upgrade also returns a 204 if *"user.upgrade"* is not provided as event value. Upgrade also returns a 401 if POLKA_KEY is not valid or not provided in the header

### Contact

You can contact me via Email:
<tobibags19@gmail.com>
