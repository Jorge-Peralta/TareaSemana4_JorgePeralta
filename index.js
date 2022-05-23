const express = require("express");
const path = require("path");
const canciones = require("./canciones");

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(3000, () => console.log("App listening on port 3000"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "artistas.html"));
});

app.use("/api", canciones);

app.get("*", (req, res) => {
  res.status(404).send("<h1> Ojo un error</h1>");
});
