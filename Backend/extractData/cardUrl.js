const { default: axios } = require("axios");
const fs = require("fs").promises;

async function cardUrl() {
  let list = JSON.parse(
    await fs.readFile("./data/characterNameList.json", "utf-8")
  );
  let cards = [];

  for (let i = 0; i < list.length; i++) {
    try {
      let data = {
        cardUrl: `https://res.cloudinary.com/dnoibyqq2/image/upload/v1617899636/genshin-app/characters/${list[i].name}/card.jpg`,
      };

      cards.push(data);
      console.log(`Url for card "${list[i].name}" has been pushed`);
    } catch (error) {
      console.log(`Error fetching Url for ${list[i]}: ${error.message}`);
    }
  }
  await fs.writeFile(
    "./cardUrls.json",
    JSON.stringify(cards, null, 2),
    "utf-8"
  );
  console.log(`Data has been written to cardUrls.json`);
}

cardUrl();
