# Organization REST API

### How to run
For local environment:
 - install dependencies with `npm install`;
 - run application with `npm start`;

With Docker:
 - run `npm run start:docker`
 
Or use Heroku: [https://organization-test-api.herokuapp.com](https://organization-test-api.herokuapp.com)

**Use any credentials for sign-in**

### Routes list
Next routes are available now:  

| Method | URI | Description | Need token 
| ----- | ------ | ------ | ------
| GET | `/organization` | Get organization list | Yes
| GET | `/organization/{id}` | Get organization details | Yes
| POST | `/organization` | Create a new organization | Yes 
| DELETE | `/organization` | Delete an organization | Yes
| PUT | `/organization` | Update an organization | Yes 
| POST | `/auth/sign-in` | Sign-in | No

### Available environment variables
 - `POSTGRES_HOST`
 - `POSTGRES_PORT`
 - `POSTGRES_USER`
 - `POSTGRES_PASSWORD`
 - `POSTGRES_DATABASE`
 - `RUN_SEEDS` - run database seeds with random data 
 - `SWAGGER_ENABLED` - use Swagger UI
 - `JWT_PUBLIC_KEY`
 - `JWT_REFRESH_KEY`
 - `JWT_SECRET_KEY`

### API Documentation
Set `SWAGGER_ENABLED` flag to use Swagger UI documentation with `/documentation` URI.

### ToDo
 - fix swagger UI in Docker container 
