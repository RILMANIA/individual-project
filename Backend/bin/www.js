const app = require("../app");
// app listener
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server can be access in http://localhost:${PORT}`);
});
