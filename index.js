const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());

// open the database
let db = new sqlite3.Database("./dua_main.sqlite");
// common function for data fetching
const dataFetch = (query, res) => {
  db.all(query, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(data);
  });
};

// get all categories
app.get("/categories", (req, res) => {
  const query = `SELECT * FROM 'category'`;

  return dataFetch(query, res);
});

// get subcategories and doa based on category id
app.get("/subcategories", (req, res) => {
  const categoryId = req.query?.cat;

  if (!categoryId) {
    return res.status(403).send({ message: "Provide a Category id !" });
  }
  const subCategoryQuery = `SELECT * FROM 'sub_category' WHERE cat_id=${categoryId}`;
  const doaQuery = `SELECT * FROM 'dua'  WHERE cat_id=${categoryId}`;
  db.all(subCategoryQuery, (err, subcat) => {
    if (err) {
      return res.status(500).send(err);
    }
    db.all(doaQuery, (error, doa) => {
      if (error) {
        return res.status(500).send(err);
      }
      return res.status(200).send({ subcategories: subcat, doa: doa });
    });
  });
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
