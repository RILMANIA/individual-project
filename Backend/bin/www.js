const app = require("../app");
// app listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server can be access in http://localhost:${PORT}`);
});
