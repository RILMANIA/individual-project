const { where, Op } = require("sequelize");
const {
  Character,
  Weapon,
  Artifact,
  FavoriteCharacter,
  MyTeam,
  CharacterList,
} = require("../models");

module.exports = class MainController {
  // public endpoints

  // GET /characters
  static async getAllCharacters(req, res) {
    try {
      const characters = await Character.findAll();
      const { search } = req.query;

      if (search) {
        const filteredCharacter = await Character.findAll({
          where: {
            name: {
              [Op.iLike]: `%${search}%`,
            },
          },
        });
        return res.status(200).json(filteredCharacter);
      }
      res.status(200).json(characters);
    } catch (error) {
      console.error(error, "<< error in MainController.getCharacters");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /weapons
  static async getAllWeapons(req, res) {
    try {
      const weapons = await Weapon.findAll();
      const { search } = req.query;
      if (search) {
        const filteredWeapon = await Weapon.findAll({
          where: {
            name: {
              [Op.iLike]: `%${search}%`,
            },
          },
        });
        return res.status(200).json(filteredWeapon);
      }
      res.status(200).json(weapons);
    } catch (error) {
      console.error(error, "<< error in MainController.getAllWeapons");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /artifacts
  static async getAllArtifacts(req, res) {
    try {
      const artifacts = await Artifact.findAll();
      res.status(200).json(artifacts);
    } catch (error) {
      console.error(error, "<< error in MainController.getAllArtifacts");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // protected endpoints

  // GET /characters/:id
  static async getCharacterById(req, res) {
    try {
      const characterId = req.params.id;
      const character = await Character.findByPk(characterId);
      const { search } = req.query;

      if (search) {
        const filteredCharacter = await Character.findAll({
          where: {
            name: {
              [Op.iLike]: `%${search}%`,
            },
          },
        });
        return res.status(200).json(filteredCharacter);
      }

      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.status(200).json(character);
    } catch (error) {
      console.error(error, "<< error in MainController.getCharacterById");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /weapons/:id
  static async getWeaponById(req, res) {
    try {
      const weaponId = req.params.id;
      const weapon = await Weapon.findByPk(weaponId);

      if (!weapon) {
        return res.status(404).json({ message: "Weapon not found" });
      }
      res.status(200).json(weapon);
    } catch (error) {
      console.error(error, "<< error in MainController.getWeaponById");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /artifacts/:id
  static async getArtifactById(req, res) {
    try {
      const artifactId = req.params.id;
      const artifact = await Artifact.findByPk(artifactId);
      if (!artifact) {
        return res.status(404).json({ message: "Artifact not found" });
      }
      res.status(200).json(artifact);
    } catch (error) {
      console.error(error, "<< error in MainController.getArtifactById");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /characters/:id/addfavorite
  static async addFavoriteCharacter(req, res) {
    try {
      const user = req.user; // from authentication middleware
      const characterId = req.params.id;
      const character = await Character.findByPk(characterId);

      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      const favoriteCharacter = await FavoriteCharacter.create({
        userId: user.id,
        characterId: character.id,
      });
      res.status(201).json(favoriteCharacter);
    } catch (error) {
      console.error(error, "<< error in MainController.addFavoriteCharacter");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /favoritecharacters
  static async getFavoriteCharacters(req, res) {
    try {
      const user = req.user; // from authentication middleware
      const favoritecharacters = await FavoriteCharacter.findAll();
      res.status(200).json(favoritecharacters);
    } catch (error) {
      console.error(error, "<< error in MainController.getFavoriteCharacters");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /myteam
  static async getMyTeams(req, res) {
    try {
      const user = req.user; // from authentication middleware
      const myteams = await MyTeam.findAll({
        where: user ? { userId: user.id } : {},
        include: CharacterList,
      });
      res.status(200).json(myteams);
    } catch (error) {
      console.error(error, "<< error in MainController.getMyTeams");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /myteams
  static async createMyTeam(req, res) {
    try {
      const user = req.user; // from authentication middleware
      const { name } = req.body;

      const myteam = await MyTeam.create({
        name,
        userId: user.id,
      });
      res.status(201).json(myteam);
    } catch (error) {
      console.error(error, "<< error in MainController.createMyTeam");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /characterlists/add
  static async addCharacterList(req, res) {
    try {
      const user = req.user; // from authentication middleware
      const { myTeamId, characterId } = req.body;

      const newCharacterList = await CharacterList.create({
        myTeamId,
        characterId,
      });
      res.status(201).json(newCharacterList);
    } catch (error) {
      console.error(error, "<< error in MainController.addCharacterList");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE /favoritecharacters/:id
  static async deleteFavoriteCharacter(req, res) {
    try {
      const user = req.user; // from authentication middleware
      const favoriteCharacterId = req.params.id;
      const favoriteCharacter = await FavoriteCharacter.findOne({
        where: user
          ? {
              id: favoriteCharacterId,
              userId: user.id,
            }
          : { id: favoriteCharacterId },
      });
      if (!favoriteCharacter) {
        return res
          .status(404)
          .json({ message: "Favorite character not found" });
      }
      await favoriteCharacter.destroy();
      res.redirect("/favoritecharacters");
    } catch (error) {
      console.error(
        error,
        "<< error in MainController.deleteFavoriteCharacter"
      );
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE /myteams/:id
  static async deleteMyTeam(req, res) {
    try {
      const user = req.user; // from authentication middleware
      const myTeamId = req.params.id;
      const myTeam = await MyTeam.findOne({
        where: user
          ? {
              id: myTeamId,
              userId: user.id,
            }
          : { id: myTeamId },
      });
      if (!myTeam) {
        return res.status(404).json({ message: "My team not found" });
      }
      await myTeam.destroy();
      res.redirect("/myteams");
    } catch (error) {
      console.error(error, "<< error in MainController.deleteMyTeam");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT /myteams/:id
  static async updateMyTeamById(req, res) {
    try {
      const user = req.user; // from authentication middleware
      const myTeamId = req.params.id;
      const { name } = req.body;
      const myTeam = await MyTeam.findOne({
        where: user
          ? {
              id: myTeamId,
              userId: user.id,
            }
          : { id: myTeamId },
        include: CharacterList,
      });
      if (!myTeam) {
        return res.status(404).json({ message: "My team not found" });
      }
      myTeam.name = name || myTeam.name;
      await myTeam.save();
      res.redirect("/myteams");
    } catch (error) {
      console.error(error, "<< error in MainController.updateMyTeamById");
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT /characterlists/:id
  static async updateCharacterListById(req, res) {
    try {
      const user = req.user; // from authentication middleware
      const characterListId = req.params.id;
      const { myTeamId, characterId } = req.body;
      const characterList = await CharacterList.findOne({
        where: {
          id: characterListId,
        },
        include: user
          ? {
              model: MyTeam,
              where: { userId: user.id },
            }
          : undefined,
      });
      if (!characterList) {
        return res.status(404).json({ message: "Character list not found" });
      }
      characterList.characterId = characterId || characterList.characterId;
      characterList.myTeamId = myTeamId || characterList.myTeamId;
      await characterList.save();
      res.redirect("/myteams");
    } catch (error) {
      console.error(
        error,
        "<< error in MainController.updateCharacterListById"
      );
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
