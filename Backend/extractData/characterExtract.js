const { default: axios } = require("axios");
const fs = require("fs").promises;

async function testFunction() {
  let list = JSON.parse(
    await fs.readFile("../data/characterNameList.json", "utf-8")
  );
  let characters = [];

  let imgUrl = JSON.parse(await fs.readFile("../data/cardUrls.json", "utf-8"));

  for (let i = 0; i < list.length; i++) {
    try {
      let response = await axios.get(
        `https://genshin.jmp.blue/characters/${list[i].name}`
      );

      let data = {
        name: response.data.name,
        title: response.data.title,
        vision: response.data.vision,
        weapon: response.data.weapon,
        gender: response.data.gender,
        nation: response.data.nation,
        affiliation: response.data.affiliation,
        rarity: response.data.rarity,
        constellation: response.data.constellation,
        description: response.data.description,
        imgUrl: imgUrl[i].cardUrl,
      };

      characters.push(data);
      console.log(`Data for ${list[i].name} has been pushed`);
    } catch (error) {
      console.log(`Error fetching data for ${list[i]}: ${error.message}`);
    }
  }
  await fs.writeFile(
    "../data/characters.json",
    JSON.stringify(characters, null, 2),
    "utf-8"
  );
  console.log(`Data has been written to data.json`);
}

testFunction();
