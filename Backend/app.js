if (process.env.NODE_ENV !== "production") {
  // hanya dipake ketika proses development
  // kalo production kita tidak menggunakan library dotenv -> env bawaan dari pm2 (runner)
  require("dotenv").config();
}

const express = require("express");
const UserController = require("./controllers/userController");
const MainController = require("./controllers/mainController");
const authentication = require("./middlewares/authentication");
const { guardMyTeam, guardCharacter } = require("./middlewares/guardOwner");
const port = process.env.PORT || 3000;

const app = express();

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//public endpoints
app.get("/", (req, res) => {
  res.redirect("/pub/characters");
});
app.get("/pub/characters", MainController.getAllCharacters);
app.get("/pub/weapons", MainController.getAllWeapons);
app.get("/pub/artifacts", MainController.getAllArtifacts);

// user endpoints
app.post("/register", UserController.register);
app.post("/login", UserController.login);
app.post("/login/google", UserController.googleLogin);

app.use(authentication); // req.user = user;

//main endpoints
app.get("/characters", MainController.getAllCharacters); // req.user
app.get("/weapons", MainController.getAllWeapons); // req.user
app.get("/artifacts", MainController.getAllArtifacts); // req.user

app.get("/characters/:id", MainController.getCharacterById); // req.user
app.post("/characters/:id/addfavorite", MainController.addFavoriteCharacter); // req.user

app.get("/weapons/:id", MainController.getWeaponById); // req.user
app.get("/artifacts/:id", MainController.getArtifactById); // req.user

app.get("/favoritecharacters", MainController.getFavoriteCharacters); // req.user

app.post("/myteams", MainController.createMyTeam); // req.user
app.get("/myteams", MainController.getMyTeams);

app.post("/characterlists/add", MainController.addCharacterList); // req.user

app.delete(
  "/favoritecharacters/:id",
  guardCharacter,
  MainController.deleteFavoriteCharacter
); // req.user
app.delete("/myteams/:id", guardMyTeam, MainController.deleteMyTeam); // req.user

app.put("/myteams/:id", guardMyTeam, MainController.updateMyTeamById);
app.put("/characterlists/:id", MainController.updateCharacterListById);

// app.listen(port, () => {
//   console.log(`Running on http://localhost:${port}`);
// });
/////////////

module.exports = app;
