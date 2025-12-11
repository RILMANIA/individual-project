const { default: axios } = require("axios");
const fs = require("fs").promises;

async function testFunction() {
  let list = JSON.parse(
    await fs.readFile("../data/artifactNames.json", "utf-8")
  );
  let artifacts = [];

  for (let i = 0; i < list.length; i++) {
    try {
      let response = await axios.get(
        `https://genshin.jmp.blue/artifacts/${list[i].name}`
      );

      let data = {
        name: response.data.name,
        max_rarity: response.data.max_rarity,
      };

      artifacts.push(data);
      console.log(`Data for artifact "${list[i].name}" has been pushed`);
    } catch (error) {
      console.log(`Error fetching data for ${list[i]}: ${error.message}`);
    }
  }
  await fs.writeFile(
    "../data/artifacts.json",
    JSON.stringify(artifacts, null, 2),
    "utf-8"
  );
  console.log(`Data has been written to artifacts.json`);
}

testFunction();
