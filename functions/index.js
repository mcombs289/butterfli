const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello Maddy!");
});

//getting documents
exports.getFlutters = functions.https.onRequest((request, response) => {
  admin
    .firestore()
    .collection("flutter")
    .get()
    .then((data) => {
      let flutters = [];
      data.forEach((doc) => {
        flutters.push(doc.data());
      });
      return response.json(flutters);
    })
    .catch((err) => console.error(err));
});

//creating documents
exports.createFlutter = functions.https.onRequest((request, response) => {
  if (request.method !== "POST") {
    return response.status(400).json({ error: "Method not allowed" });
  }

  const newFlutter = {
    body: request.body.body,
    userHandle: request.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };

  admin
    .firestore()
    .collection("flutter")
    .add(newFlutter)
    .then((doc) => {
      response.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      response.status(500).json({ error: "something went wrong" }); // server error
      console.error(err);
    });
});
