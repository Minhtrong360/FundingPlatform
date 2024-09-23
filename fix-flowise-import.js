const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "node_modules",
  "flowise-embed-react",
  "dist",
  "index.js"
);
const searchValue = "import 'flowise-embed/dist/web';";
const replaceValue = "import 'flowise-embed/dist/web.js';";

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    return console.log(err);
  }
  const result = data.replace(searchValue, replaceValue);
  fs.writeFile(filePath, result, "utf8", (err) => {
    if (err) return console.log(err);
  });
});
