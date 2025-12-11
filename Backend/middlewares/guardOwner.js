const { FavoriteCharacter, MyTeam } = require("../models");

async function guardCharacter(req, res, next) {
  const favoriteCharacterId = req.params.id;
  const favoriteCharacter = await FavoriteCharacter.findByPk(
    favoriteCharacterId
  );
  if (!favoriteCharacter) {
    res.status(404).json({
      message: "Data not found",
    });
    return;
  }

  if (favoriteCharacter.userId !== req.user.id) {
    res.status(403).json({
      message: "You are not authorized",
    });
    return;
  }

  next();
}

async function guardMyTeam(req, res, next) {
  // Similar implementation for MyTeam model
  const myTeamId = req.params.id;
  const myTeam = await MyTeam.findByPk(myTeamId);
  if (!myTeam) {
    res.status(404).json({
      message: "Data not found",
    });
    return;
  }
  if (myTeam.userId !== req.user.id) {
    res.status(403).json({
      message: "You are not authorized",
    });
    return;
  }
  next();
}

module.exports = { guardCharacter, guardMyTeam };
