const express = require("express");
const fs = require("fs");
const fr = require("filereader");
const app = express();
const port = 3300;

//fs.readFile("LE.txt", (err, data) => {
//  if (err) throw err;

//  console.log(data.toString());
//});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/spare-parts", (req, res) => {
  fs.readFile("LE.txt", (err, data) => {
    if (err) throw err;

    function tsvJSON() {
      var lines = data.toString().split("\n");

      var result = [];

      var headers = ["tootekood", "toode", "hind"];

      for (var i = 0; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split("\t");
        for (let j = 0; j < currentline.length; j++) {
          currentline[j] = currentline[j].replace(/\"/g, "");
        }

        obj[headers[0]] = currentline[0];
        obj[headers[1]] = currentline[1];
        obj[headers[2]] = currentline[10];

        result.push(obj);
      }

      //return result; //JavaScript object
      return result; //JSON
    }

    //console.log(data.toString());
    res.send(tsvJSON(data));
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
