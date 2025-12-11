const { default: axios } = require("axios");
const fs = require("fs").promises;

async function testFunction() {
  let list = JSON.parse(await fs.readFile("../data/weaponNames.json", "utf-8"));
  let weapons = [];

  for (let i = 0; i < list.length; i++) {
    try {
      let response = await axios.get(
        `https://genshin.jmp.blue/weapons/${list[i].name}`
      );

      let data = {
        name: response.data.name,
        type: response.data.type,
        rarity: response.data.rarity,
        baseAttack: response.data.baseAttack,
      };

      weapons.push(data);
      console.log(`Data for weapon "${list[i].name}" has been pushed`);
    } catch (error) {
      console.log(`Error fetching data for ${list[i]}: ${error.message}`);
    }
  }
  await fs.writeFile(
    "../data/weapons.json",
    JSON.stringify(weapons, null, 2),
    "utf-8"
  );
  console.log(`Data has been written to weapons.json`);
}

testFunction();
