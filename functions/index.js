const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require("express");

const app = express();

app.get("/flutter", (req, res) => {
  admin
    .firestore()
    .collection("flutter")
    .orderBy("createdAt", "desc") //order by created dat
    .get()
    .then((data) => {
      let flutters = [];
      data.forEach((doc) => {
        flutters.push(doc.data());
      });
      return res.json(flutters);
    })
    .catch((err) => console.error(err));
});

app.post("/flutter", (req, res) => {
  const newFlutter = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };

  admin
    .firestore()
    .collection("flutter")
    .add(newFlutter)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" }); // server error
      console.error(err);
    });
});

//
exports.api = functions.https.onRequest(app);
