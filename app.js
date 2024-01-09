const express = require("express");
const path = require('path');
const app = express();
const setupMiddleware = require("./middleware/middleware");
const setupRouter = require("./routes/routes");
const setupDatabase = require("./configs/db.config");

setupMiddleware(app);
setupDatabase();
setupRouter(app);

const PORT = 8080;

app.use('/uploads/avatar', express.static(path.join(__dirname, 'uploads', 'avatar')));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
