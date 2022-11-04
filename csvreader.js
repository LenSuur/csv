const express = require("express");

const fs = require("fs");
const fr = require("filereader");

const app = express();
const port = 3300;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/spare-parts", (req, res) => {
  const page = req.query.page || 1;
  let pageSize = 10;

  fs.readFile("LE.txt", (err, data) => {
    if (err) throw err;

    function tsvJSON() {
      var lines = data.toString().split("\n");

      var result = [];

      var headers = ["tootekood", "toode", "hind"];
      //tabi ja jutumärkide trimm
      for (var i = 0; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split("\t");
        for (let j = 0; j < currentline.length; j++) {
          currentline[j] = currentline[j].replace(/(^"|"$)/g, "");
        }
        //andmete määramine tulpadesse
        obj[headers[0]] = parseFloat(currentline[0]);
        obj[headers[1]] = currentline[1];
        obj[headers[2]] = parseFloat(currentline[10]);

        result.push(obj);
      }
      //JSON
      return result;
    }
    let spareParts = tsvJSON(data);

    //sorteerimise valikud

    const sortBy = req.query.sort || "hind";
    function sort(a, b) {
      if (sortBy == "tootekood") {
        return a[sortBy] - b[sortBy];
      } else if (sortBy == "toode") {
        return a[sortBy] < b[sortBy] ? -1 : 1;
      } else if (sortBy == "hind") {
        return a[sortBy] - b[sortBy];
      } else if (sortBy == "-tootekood") {
        return b[sortBy.substring(1)] - a[sortBy.substring(1)];
      } else if (sortBy == "-toode") {
        return a[sortBy.substring(1)] < b[sortBy.substring(1)] ? 1 : -1;
      } else if (sortBy == "-hind") {
        return b[sortBy.substring(1)] - a[sortBy.substring(1)];
      } else {
        res.send("Wrong sort parameter! Tsk, tsk!");
      }
    }
    // Otsing
    let nimi = req.query.nimi || "";
    spareParts = spareParts.filter((spareParts) =>
      spareParts.toode.includes(nimi)
    );
    //Sorteerimine
    spareParts.sort(sort);

    let pageData = spareParts.slice(pageSize * (page - 1), pageSize * page);

    res.send(pageData);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
