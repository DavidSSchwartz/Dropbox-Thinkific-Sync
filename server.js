// import express from "express";
// import bodyParser from "body-parser";
// import crypto from "crypto";
// import { handleDropboxEvent } from "./processor.js";

// const app = express();

// // Needed for webhook signature verification
// app.use(
//   bodyParser.json({
//     verify: (req, res, buf) => {
//       req.rawBody = buf;
//     }
//   })
// );

// app.get("/health", (_, res) => {
//   res.send("ok");
// });

// /**
//  * Dropbox webhook verification
//  */
// app.get("/webhook/dropbox", (req, res) => {
//   res.send(req.query.challenge);
// });

// /**
//  * Dropbox webhook receiver
//  */
// app.post("/webhook/dropbox", async (req, res) => {
//   if (!verifyDropboxSignature(req)) {
//     return res.status(401).send("Invalid signature");
//   }

//   // Dropbox expects a fast response
//   res.status(200).send("OK");

//   // Process async
//   handleDropboxEvent().catch(err => {
//     console.error("Processing error:", err);
//   });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Listening on ${PORT}`);
// });

// /**
//  * Verify Dropbox webhook signature
//  */
// function verifyDropboxSignature(req) {
//   const signature = req.headers["x-dropbox-signature"];
//   if (!signature) return false;

//   const expected = crypto
//     .createHmac("sha256", process.env.DROPBOX_APP_SECRET)
//     .update(req.rawBody)
//     .digest("hex");

//   return expected === signature;
// }


import express from "express";
import { syncDropboxFolder } from "./sync.js";

const app = express();
app.use(express.json());

// Dropbox webhook challenge verification
app.get("/webhook/dropbox", (req, res) => {
  res.send(req.query.challenge);
});

// Webhook trigger
app.post("/webhook/dropbox", (req, res) => {
  console.log("Dropbox webhook received");
  syncDropboxFolder(); // run async, do NOT await
  res.sendStatus(200); // respond immediately
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
