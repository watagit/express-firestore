const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const ServiceAccount = require("./json/express-firestore-f6df6-firebase-adminsdk-xc359-dcb8453a09.json");

admin.initializeApp({ credential: admin.credential.cert(ServiceAccount) });

const db = admin.firestore();
const docRef = db.collection("messages");

const app = express();
app.use(bodyParser.json());

app.get("/hello", (req, res) => {
  res.send("Hello");
});

app.get("/messages", async (req, res) => {
  const snapshot = await docRef.get();
  const messages = snapshot.docs.map(doc => doc.data());
  res.send(messages);
});

app.post("/messages", async (req, res) => {
  const message = {
    text: req.body.text,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };

  await docRef.add(message);
  res.send(message);
});

app.post("/signup", async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const userRef = db.collection("users").doc(user.email);

  const setUser = userRef.set({
    email: user.email,
    password: user.password,
  });

  res.send(user);
});

const port = "8080";
app.listen(port, () => console.log(`app start listening on port ${port}`));

