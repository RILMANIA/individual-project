# API Documentation

Base URL: `http://localhost:3000`

## Table of Contents

- [Public Endpoints](#public-endpoints)
- [User Endpoints](#user-endpoints)
- [Protected Endpoints](#protected-endpoints)
  - [Characters](#characters)
  - [Weapons](#weapons)
  - [Artifacts](#artifacts)
  - [Favorite Characters](#favorite-characters)
  - [My Teams](#my-teams)
  - [Character Lists](#character-lists)

---

## Public Endpoints

These endpoints do not require authentication.

### Get All Characters (Public)

Get a list of all characters.

- **URL**: `/pub/characters`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `search` (optional): Filter characters by name (case-insensitive)

**Success Response:**

- **Code**: 200
- **Content**:
  ```json
  [
    {
      "id": 1,
      "name": "Character Name",
      "element": "Pyro",
      "rarity": 5,
      ...
    }
  ]
  ```

**Error Response:**

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

### Get All Weapons (Public)

Get a list of all weapons.

- **URL**: `/pub/weapons`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `search` (optional): Filter weapons by name (case-insensitive)

**Success Response:**

- **Code**: 200
- **Content**:
  ```json
  [
    {
      "id": 1,
      "name": "Weapon Name",
      "type": "Sword",
      "rarity": 5,
      ...
    }
  ]
  ```

**Error Response:**

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

### Get All Artifacts (Public)

Get a list of all artifacts.

- **URL**: `/pub/artifacts`
- **Method**: `GET`
- **Auth Required**: No

**Success Response:**

- **Code**: 200
- **Content**:
  ```json
  [
    {
      "id": 1,
      "name": "Artifact Name",
      ...
    }
  ]
  ```

**Error Response:**

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

## User Endpoints

### Register

Create a new user account.

- **URL**: `/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

**Success Response:**

- **Code**: 201
- **Content**:
  ```json
  {
    "id": 1,
    "username": "username",
    "email": "user@example.com",
    "password": "hashed_password"
  }
  ```

**Error Responses:**

- **Code**: 400 (Validation Error)
- **Content**: `{ "message": "Validation error message" }`

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

### Login

Authenticate a user and receive an access token.

- **URL**: `/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

**Success Response:**

- **Code**: 200
- **Content**:
  ```json
  {
    "access_token": "jwt_token_here"
  }
  ```

**Error Responses:**

- **Code**: 400 (Missing Fields)
- **Content**: `{ "message": "Email is required" }` or `{ "message": "Password is required" }`

- **Code**: 401 (Invalid Credentials)
- **Content**: `{ "message": "Invalid email/password" }`

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

## Protected Endpoints

All endpoints below require authentication. Include the access token in the request headers:

```
Authorization: Bearer <access_token>
```

### Characters

#### Get All Characters

Get a list of all characters (authenticated version).

- **URL**: `/characters`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `search` (optional): Filter characters by name (case-insensitive)

**Success Response:**

- **Code**: 200
- **Content**: Array of character objects

**Error Response:**

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

#### Get Character by ID

Get details of a specific character.

- **URL**: `/characters/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Character ID
- **Query Parameters**:
  - `search` (optional): Filter characters by name (case-insensitive)

**Success Response:**

- **Code**: 200
- **Content**:
  ```json
  {
    "id": 1,
    "name": "Character Name",
    "element": "Pyro",
    "rarity": 5,
    ...
  }
  ```

**Error Responses:**

- **Code**: 404
- **Content**: `{ "message": "Character not found" }`

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

#### Add Character to Favorites

Add a character to the user's favorites.

- **URL**: `/characters/:id/addfavorite`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Character ID

**Success Response:**

- **Code**: 201
- **Content**:
  ```json
  {
    "id": 1,
    "userId": 1,
    "characterId": 1,
    ...
  }
  ```

**Error Responses:**

- **Code**: 404
- **Content**: `{ "message": "Character not found" }`

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

### Weapons

#### Get All Weapons

Get a list of all weapons (authenticated version).

- **URL**: `/weapons`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `search` (optional): Filter weapons by name (case-insensitive)

**Success Response:**

- **Code**: 200
- **Content**: Array of weapon objects

**Error Response:**

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

#### Get Weapon by ID

Get details of a specific weapon.

- **URL**: `/weapons/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Weapon ID

**Success Response:**

- **Code**: 200
- **Content**:
  ```json
  {
    "id": 1,
    "name": "Weapon Name",
    "type": "Sword",
    "rarity": 5,
    ...
  }
  ```

**Error Responses:**

- **Code**: 404
- **Content**: `{ "message": "Weapon not found" }`

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

### Artifacts

#### Get All Artifacts

Get a list of all artifacts (authenticated version).

- **URL**: `/artifacts`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response:**

- **Code**: 200
- **Content**: Array of artifact objects

**Error Response:**

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

#### Get Artifact by ID

Get details of a specific artifact.

- **URL**: `/artifacts/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Artifact ID

**Success Response:**

- **Code**: 200
- **Content**:
  ```json
  {
    "id": 1,
    "name": "Artifact Name",
    ...
  }
  ```

**Error Responses:**

- **Code**: 404
- **Content**: `{ "message": "Artifact not found" }`

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

### Favorite Characters

#### Get Favorite Characters

Get all favorite characters for the authenticated user.

- **URL**: `/favoritecharacters`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response:**

- **Code**: 200
- **Content**:
  ```json
  [
    {
      "id": 1,
      "userId": 1,
      "characterId": 1,
      ...
    }
  ]
  ```

**Error Response:**

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

#### Delete Favorite Character

Remove a character from favorites.

- **URL**: `/favoritecharacters/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Authorization**: User must own the favorite character
- **URL Parameters**:
  - `id`: Favorite Character ID

**Success Response:**

- **Code**: 302 (Redirect to `/favoritecharacters`)

**Error Responses:**

- **Code**: 404
- **Content**: `{ "message": "Favorite character not found" }`

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

### My Teams

#### Get My Teams

Get all teams created by the authenticated user.

- **URL**: `/myteams`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response:**

- **Code**: 200
- **Content**:
  ```json
  [
    {
      "id": 1,
      "name": "Team Name",
      "userId": 1,
      "CharacterLists": [...]
    }
  ]
  ```

**Error Response:**

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

#### Create My Team

Create a new team.

- **URL**: `/myteams`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "string"
  }
  ```

**Success Response:**

- **Code**: 201
- **Content**:
  ```json
  {
    "id": 1,
    "name": "Team Name",
    "userId": 1,
    ...
  }
  ```

**Error Response:**

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

#### Update My Team

Update a team's details.

- **URL**: `/myteams/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Authorization**: User must own the team
- **URL Parameters**:
  - `id`: Team ID
- **Request Body**:
  ```json
  {
    "name": "string"
  }
  ```

**Success Response:**

- **Code**: 302 (Redirect to `/myteams`)

**Error Responses:**

- **Code**: 404
- **Content**: `{ "message": "My team not found" }`

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

#### Delete My Team

Delete a team.

- **URL**: `/myteams/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Authorization**: User must own the team
- **URL Parameters**:
  - `id`: Team ID

**Success Response:**

- **Code**: 302 (Redirect to `/myteams`)

**Error Responses:**

- **Code**: 404
- **Content**: `{ "message": "My team not found" }`

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

### Character Lists

#### Add Character to List

Add a character to a team's character list.

- **URL**: `/characterlists/add`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "myTeamId": 1,
    "characterId": 1
  }
  ```

**Success Response:**

- **Code**: 201
- **Content**:
  ```json
  {
    "id": 1,
    "myTeamId": 1,
    "characterId": 1,
    ...
  }
  ```

**Error Response:**

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

#### Update Character List

Update a character list entry.

- **URL**: `/characterlists/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Authorization**: User must own the team associated with the character list
- **URL Parameters**:
  - `id`: Character List ID
- **Request Body**:
  ```json
  {
    "myTeamId": 1,
    "characterId": 1
  }
  ```

**Success Response:**

- **Code**: 302 (Redirect to `/myteams`)

**Error Responses:**

- **Code**: 404
- **Content**: `{ "message": "Character list not found" }`

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

---

## Authentication

Protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

To obtain a token, use the `/login` endpoint with valid credentials.

---

## Error Responses

All endpoints may return the following error:

- **Code**: 500
- **Content**: `{ "message": "Internal server error" }`

Protected endpoints may also return:

- **Code**: 401
- **Content**: Authentication error (token missing or invalid)
- **Code**: 403
- **Content**: Authorization error (insufficient permissions)
