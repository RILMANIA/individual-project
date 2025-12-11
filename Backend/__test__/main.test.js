const request = require("supertest");
const app = require("../app");
const {
  sequelize,
  User,
  Character,
  Weapon,
  Artifact,
  FavoriteCharacter,
  MyTeam,
  CharacterList,
} = require("../models");
const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");

jest.setTimeout(30000); // Increase timeout for database operations

let access_token;
let testUser;
let testCharacter;
let testWeapon;
let testArtifact;
let testFavoriteCharacter;
let testMyTeam;
let testCharacterList;

beforeAll(async () => {
  // Clear existing data
  await CharacterList.destroy({ where: {}, force: true });
  await MyTeam.destroy({ where: {}, force: true });
  await FavoriteCharacter.destroy({ where: {}, force: true });
  await Character.destroy({ where: {}, force: true });
  await Weapon.destroy({ where: {}, force: true });
  await Artifact.destroy({ where: {}, force: true });
  await User.destroy({ where: {}, force: true });

  // Create test user
  const hashedPassword = hashPassword("password123");
  testUser = await User.create({
    username: "testuser",
    email: "test@example.com",
    password: hashedPassword,
  });

  access_token = signToken({ email: testUser.email });

  // Create test data
  testCharacter = await Character.create({
    name: "Test Character",
    vision: "Pyro",
    weapon: "Sword",
    rarity: 5,
    nation: "Mondstadt",
  });

  testWeapon = await Weapon.create({
    name: "Test Weapon",
    type: "Sword",
    rarity: 5,
  });

  testArtifact = await Artifact.create({
    name: "Test Artifact",
    maxRarity: 5,
  });
});

afterAll(async () => {
  // Clean up test data
  await CharacterList.destroy({ where: {} });
  await MyTeam.destroy({ where: {} });
  await FavoriteCharacter.destroy({ where: {} });
  await Character.destroy({ where: {} });
  await Weapon.destroy({ where: {} });
  await Artifact.destroy({ where: {} });
  await User.destroy({ where: {} });
  await sequelize.close();
});

describe("Public Endpoints", () => {
  describe("GET /pub/characters", () => {
    test("should return all characters with status 200", async () => {
      const response = await request(app).get("/pub/characters");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /pub/weapons", () => {
    test("should return all weapons with status 200", async () => {
      const response = await request(app).get("/pub/weapons");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /pub/artifacts", () => {
    test("should return all artifacts with status 200", async () => {
      const response = await request(app).get("/pub/artifacts");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /", () => {
    test("should redirect to /pub/characters", async () => {
      const response = await request(app).get("/");
      expect([301, 302]).toContain(response.status);
    });
  });
});

describe("User Endpoints", () => {
  describe("POST /register", () => {
    test("should register a new user with status 201", async () => {
      const response = await request(app).post("/register").send({
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
      });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("username", "newuser");
      expect(response.body).toHaveProperty("email", "newuser@example.com");
    });

    test("should return 400 if email already exists", async () => {
      const response = await request(app).post("/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      expect(response.status).toBe(400);
    });
  });

  describe("POST /login", () => {
    test("should login with valid credentials", async () => {
      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "password123",
      });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token");
    });

    test("should return 401 with invalid credentials", async () => {
      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });
      expect(response.status).toBe(401);
    });
  });
});

describe("Protected Endpoints - Characters", () => {
  describe("GET /characters", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).get("/characters");
      expect(response.status).toBe(401);
    });

    test("should return all characters with status 200", async () => {
      const response = await request(app)
        .get("/characters")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should filter characters by search query", async () => {
      const response = await request(app)
        .get("/characters?search=Test")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /characters/:id", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).get(
        `/characters/${testCharacter.id}`
      );
      expect(response.status).toBe(401);
    });

    test("should return a character by id with status 200", async () => {
      const response = await request(app)
        .get(`/characters/${testCharacter.id}`)
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", testCharacter.id);
      expect(response.body).toHaveProperty("name");
    });

    test("should return 404 if character not found", async () => {
      const response = await request(app)
        .get("/characters/99999")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Character not found");
    });
  });

  describe("POST /characters/:id/addfavorite", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).post(
        `/characters/${testCharacter.id}/addfavorite`
      );
      expect(response.status).toBe(401);
    });

    test("should add character to favorites with status 201", async () => {
      const response = await request(app)
        .post(`/characters/${testCharacter.id}/addfavorite`)
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("characterId", testCharacter.id);

      // Save for later tests
      testFavoriteCharacter = response.body;
    });

    test("should return 404 if character not found", async () => {
      const response = await request(app)
        .post("/characters/99999/addfavorite")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Character not found");
    });
  });
});

describe("Protected Endpoints - Weapons", () => {
  describe("GET /weapons", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).get("/weapons");
      expect(response.status).toBe(401);
    });

    test("should return all weapons with status 200", async () => {
      const response = await request(app)
        .get("/weapons")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should filter weapons by search query", async () => {
      const response = await request(app)
        .get("/weapons?search=Test")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /weapons/:id", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).get(`/weapons/${testWeapon.id}`);
      expect(response.status).toBe(401);
    });

    test("should return a weapon by id with status 200", async () => {
      const response = await request(app)
        .get(`/weapons/${testWeapon.id}`)
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", testWeapon.id);
      expect(response.body).toHaveProperty("name");
    });

    test("should return 404 if weapon not found", async () => {
      const response = await request(app)
        .get("/weapons/99999")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Weapon not found");
    });
  });
});

describe("Protected Endpoints - Artifacts", () => {
  describe("GET /artifacts", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).get("/artifacts");
      expect(response.status).toBe(401);
    });

    test("should return all artifacts with status 200", async () => {
      const response = await request(app)
        .get("/artifacts")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /artifacts/:id", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).get(`/artifacts/${testArtifact.id}`);
      expect(response.status).toBe(401);
    });

    test("should return an artifact by id with status 200", async () => {
      const response = await request(app)
        .get(`/artifacts/${testArtifact.id}`)
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", testArtifact.id);
      expect(response.body).toHaveProperty("name");
    });

    test("should return 404 if artifact not found", async () => {
      const response = await request(app)
        .get("/artifacts/99999")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Artifact not found");
    });
  });
});

describe("Protected Endpoints - Favorite Characters", () => {
  describe("GET /favoritecharacters", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).get("/favoritecharacters");
      expect(response.status).toBe(401);
    });

    test("should return all favorite characters with status 200", async () => {
      const response = await request(app)
        .get("/favoritecharacters")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("DELETE /favoritecharacters/:id", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).delete("/favoritecharacters/99999");
      expect(response.status).toBe(401);
    });

    test("should return 404 if favorite character not found", async () => {
      const response = await request(app)
        .delete("/favoritecharacters/99999")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(404);
    });

    test("should delete favorite character with redirect", async () => {
      if (testFavoriteCharacter) {
        const response = await request(app)
          .delete(`/favoritecharacters/${testFavoriteCharacter.id}`)
          .set("Authorization", `Bearer ${access_token}`);
        expect([301, 302]).toContain(response.status);
      }
    });
  });
});

describe("Protected Endpoints - MyTeams", () => {
  describe("POST /myteams", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app)
        .post("/myteams")
        .send({ name: "Unauthorized Team" });
      expect(response.status).toBe(401);
    });

    test("should create a new team with status 201", async () => {
      const response = await request(app)
        .post("/myteams")
        .send({ name: "Test Team" })
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "Test Team");

      // Save for later tests
      testMyTeam = response.body;
    });
  });

  describe("GET /myteams", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).get("/myteams");
      expect(response.status).toBe(401);
    });

    test("should return all teams for the user with status 200", async () => {
      const response = await request(app)
        .get("/myteams")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("PUT /myteams/:id", () => {
    test("should return 401 without authentication", async () => {
      if (testMyTeam) {
        const response = await request(app)
          .put(`/myteams/${testMyTeam.id}`)
          .send({ name: "Unauthorized Update" });
        expect(response.status).toBe(401);
      }
    });

    test("should update team name with redirect", async () => {
      if (testMyTeam) {
        const response = await request(app)
          .put(`/myteams/${testMyTeam.id}`)
          .send({ name: "Updated Team Name" })
          .set("Authorization", `Bearer ${access_token}`);
        expect([301, 302]).toContain(response.status);
      }
    });

    test("should return 404 if team not found", async () => {
      const response = await request(app)
        .put("/myteams/99999")
        .send({ name: "Updated Name" })
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /myteams/:id", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).delete("/myteams/99999");
      expect(response.status).toBe(401);
    });

    test("should return 404 if team not found", async () => {
      const response = await request(app)
        .delete("/myteams/99999")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(404);
    });

    test("should delete team with redirect", async () => {
      if (testMyTeam) {
        const response = await request(app)
          .delete(`/myteams/${testMyTeam.id}`)
          .set("Authorization", `Bearer ${access_token}`);
        expect([301, 302]).toContain(response.status);
      }
    });
  });
});

describe("Protected Endpoints - Character Lists", () => {
  let newMyTeam;

  beforeAll(async () => {
    // Create a team for character list tests
    newMyTeam = await MyTeam.create({
      name: "Team for CharacterList",
      userId: testUser.id,
    });
  });

  describe("POST /characterlists/add", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).post("/characterlists/add").send({
        myTeamId: newMyTeam.id,
        characterId: testCharacter.id,
      });
      expect(response.status).toBe(401);
    });

    test("should add character to team with status 201", async () => {
      const response = await request(app)
        .post("/characterlists/add")
        .send({
          myTeamId: newMyTeam.id,
          characterId: testCharacter.id,
        })
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("myTeamId", newMyTeam.id);

      // Get the inserted ID from database
      const insertedList = await CharacterList.findOne({
        where: {
          myTeamId: newMyTeam.id,
          characterId: testCharacter.id,
        },
      });
      testCharacterList = insertedList;
    });
  });

  describe("PUT /characterlists/:id", () => {
    test("should return 401 without authentication", async () => {
      if (testCharacterList && testCharacterList.id) {
        const response = await request(app)
          .put(`/characterlists/${testCharacterList.id}`)
          .send({
            myTeamId: newMyTeam.id,
            characterId: testCharacter.id,
          });
        expect(response.status).toBe(401);
      }
    });

    test("should update character list with redirect", async () => {
      if (testCharacterList && testCharacterList.id) {
        const response = await request(app)
          .put(`/characterlists/${testCharacterList.id}`)
          .send({
            myTeamId: newMyTeam.id,
            characterId: testCharacter.id,
          })
          .set("Authorization", `Bearer ${access_token}`);
        expect([301, 302]).toContain(response.status);
      }
    });

    test("should return 404 if character list not found", async () => {
      const response = await request(app)
        .put("/characterlists/99999")
        .send({
          myTeamId: newMyTeam.id,
          characterId: testCharacter.id,
        })
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(404);
    });
  });
});

describe("Error Handling Tests", () => {
  test("GET /characters with non-existent ID returns 404", async () => {
    const response = await request(app)
      .get("/characters/999999")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(404);
  });

  test("GET /weapons with non-existent ID returns 404", async () => {
    const response = await request(app)
      .get("/weapons/999999")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(404);
  });

  test("GET /artifacts with non-existent ID returns 404", async () => {
    const response = await request(app)
      .get("/artifacts/999999")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(404);
  });
});
