// // import express from "express";
// // import bodyParser from "body-parser";
// // import crypto from "crypto";
// // import { handleDropboxEvent } from "./processor.js";
import axios from "axios";

// // const app = express();

// // // Needed for webhook signature verification
// // app.use(
// //   bodyParser.json({
// //     verify: (req, res, buf) => {
// //       req.rawBody = buf;
// //     }
// //   })
// // );

// // app.get("/health", (_, res) => {
// //   res.send("ok");
// // });

// // /**
// //  * Dropbox webhook verification
// //  */
// // app.get("/webhook/dropbox", (req, res) => {
// //   res.send(req.query.challenge);
// // });

// // /**
// //  * Dropbox webhook receiver
// //  */
// // app.post("/webhook/dropbox", async (req, res) => {
// //   if (!verifyDropboxSignature(req)) {
// //     return res.status(401).send("Invalid signature");
// //   }

// //   // Dropbox expects a fast response
// //   res.status(200).send("OK");

// //   // Process async
// //   handleDropboxEvent().catch(err => {
// //     console.error("Processing error:", err);
// //   });
// // });

// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //   console.log(`Listening on ${PORT}`);
// // });

// // /**
// //  * Verify Dropbox webhook signature
// //  */
// // function verifyDropboxSignature(req) {
// //   const signature = req.headers["x-dropbox-signature"];
// //   if (!signature) return false;

// //   const expected = crypto
// //     .createHmac("sha256", process.env.DROPBOX_APP_SECRET)
// //     .update(req.rawBody)
// //     .digest("hex");

// //   return expected === signature;
// // }

// import express from "express";
// import { syncDropboxFolder } from "./sync.js";

// const app = express();
// app.use(express.json());

// // Dropbox webhook challenge verification
// app.get("/webhook/dropbox", (req, res) => {
//   res.send(req.query.challenge);
// });

// // Webhook trigger
// app.post("/webhook/dropbox", (req, res) => {
//   console.log("Dropbox webhook received");
//   syncDropboxFolder(); // run async, do NOT await
//   res.sendStatus(200); // respond immediately
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import { handleDropboxEvent } from "./processor.js";
import dotenv from "dotenv";
import { getOrCreateCourse } from "./courses.js";

dotenv.config();
const app = express();
app.use(express.json());

// Dropbox webhook verification
app.get("/webhook/dropbox", (req, res) => {
  res.send(req.query.challenge);
});

// Dropbox webhook trigger
app.post("/webhook/dropbox", (req, res) => {
  console.log("Dropbox webhook received");
  handleDropboxEvent(); // async, don’t await
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

async function a() {
  console.log(process.env.THINKIFIC_API_KEY);
  // let c = await axios.get("https://api.thinkific.com/api/public/v1/courses", {
  //   headers: {
  //     Authorization: `Bearer ${process.env.THINKIFIC_API_KEY}`,
  //     Accept: "application/json",
  //     "X-Auth-Subdomain": process.env.THINKIFIC_SUBDOMAIN, // Add this!
  //   },
  // });
  // console.log(c);
  //  let b = await axios.post(
  //     `https://api.thinkific.com/api/public/v1/courses`,
  //     { name:"a good namee" },
  //     {
  //       headers: {
  //         "X-Auth-API-Key": process.env.THINKIFIC_API_KEY,
  //         "X-Auth-Subdomain": process.env.THINKIFIC_SUBDOMAIN,
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   console.log(b)
  // const x = await axios.get(
  //   "https://api.thinkific.com/api/public/v1/courses/3330494",
  //   {
  //     headers: {
  //       "X-Auth-API-Key": "2f54e499a4ae9747160b02e24cedbbd6",
  //       "X-Auth-Subdomain": "virtualhalacha",
  //     },
  //   }
  // );
  // console.log(JSON.stringify(x.data, null, 2));

  // const x = await axios.post(
  //   `https://api.thinkific.com/api/public/v1/courses/3330494/chapters`,
  //   { title: "the chapter tilet", course_id: 3330494 },
  //   {
  //     headers: {
  //       "X-Auth-API-Key": process.env.THINKIFIC_API_KEY,
  //       "X-Auth-Subdomain": process.env.THINKIFIC_SUBDOMAIN,
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );
  // console.log(x);
  const headers = {
    headers: {
      "X-Auth-API-Key": process.env.THINKIFIC_API_KEY,
      "X-Auth-Subdomain": process.env.THINKIFIC_SUBDOMAIN,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  // await axios.get("https://api.thinkific.com/api/public/v1/contents", {
  //   ...headers,
  // });
  // await axios.get("https://api.thinkific.com/api/public/v1/lessons", {
  //   ...headers,
  // });
  // const rr = await axios.post(
  //   "https://learn.vhalacha.com/users/sign_in",
  //   {
  //     user: {
  //       email: "virtualhalachaprogram@gmail.com",
  //       password: "RAVADAMVHP",
  //     },
  //   },
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     withCredentials: true,
  //     maxRedirects: 0,
  //     validateStatus: (status) => status < 400 || status === 302,
  //   }
  // );

  // console.log(rr.headers["set-cookie"]);
  // return
  // Step 1: Login and get session
  const loginResponse = await axios.post(
    "https://learn.vhalacha.com/users/sign_in",
    {
      user: {
        email: "virtualhalachaprogram@gmail.com",
        password: "RAVADAMVHP",
      },
    },
    {
      headers: { "Content-Type": "application/json" },
      maxRedirects: 0,
      validateStatus: (status) => status < 500,
    }
  );

  const cookies = loginResponse.headers["set-cookie"];
  const sessionCookie = cookies
    .find((c) => c.startsWith("_thinkific_session"))
    .split(";")[0];

  // Step 2: Hit the admin page to get graphql_token
  const adminResponse = await axios.get(
    "https://learn.vhalacha.com/manage/courses/3330494",
    {
      headers: {
        Cookie: sessionCookie,
      },
    }
  );

  // Check if graphql_token is in the new cookies
  console.log(adminResponse.headers["set-cookie"]);

  // Also check if it's embedded in the HTML
  const html = adminResponse.data;
  console.log(html.includes("graphql_token"));
  console.log(html.includes("eyJ")); // JWT tokens start with this

  if (html.includes("graphql_token")) {
    console.log("Found graphql_token in HTML!");
    // Extract it with regex
    const match = html.match(/graphql_token['":\s]+([^'";\s]+)/);
    console.log(match);
  }
  return;
  // const pageResponse = await axios.get(
  //   "https://learn.vhalacha.com/manage/courses",
  //   {
  //     headers: {
  //       Cookie:
  //         "_thinkific_session=QXk2RmNZLzhTWFFNckV2MDcrME9MVGx6WERSWVRXc3hTVUFuTTNmV0Z0TnlVU0NOTEJXS2gxUml1ZDNkQmxXVFAwdmRLYXNhNHRZVW0yWlJtb2N5Zk9mR01IK3ZoV2Q4T1dCQlMzZ3RoM2ZyVm5ZdC81NGhIMG9heUN6K0c3ZzZsWnZMajN0dmNKREJiSkVWWkZnTVpaWFF5L29kTC9BWlhyUFZLVDVWb05mMlRpMko5MjFua0xjTTZHT1NCdVBrNjlFYUxLMDhTem1IUmZJRWloTTBBc0xLQ0pDSGxMTkpyeVE0Q3dxRGFlTT0tLVZsSUtPeHFlSmk2REpWaThNVU51dWc9PQ%3D%3D--dea6944acc9967bd9a8005718f7299b559b12b94",
  //     },
  //   }
  // );

  // Look for csrf token in response or cookies
  console.log(pageResponse.headers["set-cookie"]);
  return;
  const response = await axios.post(
    "https://learn.vhalacha.com/api/graphql",
    {
      operationName: "CreateChapter",
      variables: {
        name: "Test Chapter from API",
        setNewLessonsToDraft: false,
        courseId: "Q291cnNlLTMzMzA0OTQ=",
      },
      query: `mutation CreateChapter($courseId: ID!, $name: String!, $position: Int, $setNewLessonsToDraft: Boolean) {
      createChapter(input: {courseId: $courseId, position: $position, name: $name, setNewLessonsToDraft: $setNewLessonsToDraft}) {
        chapter {
          id
          name
          position
        }
        userErrors {
          code
          message
        }
      }
    }`,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Cookie:
          "_thinkific_session=QXk2RmNZLzhTWFFNckV2MDcrME9MVGx6WERSWVRXc3hTVUFuTTNmV0Z0TnlVU0NOTEJXS2gxUml1ZDNkQmxXVFAwdmRLYXNhNHRZVW0yWlJtb2N5Zk9mR01IK3ZoV2Q4T1dCQlMzZ3RoM2ZyVm5ZdC81NGhIMG9heUN6K0c3ZzZsWnZMajN0dmNKREJiSkVWWkZnTVpaWFF5L29kTC9BWlhyUFZLVDVWb05mMlRpMko5MjFua0xjTTZHT1NCdVBrNjlFYUxLMDhTem1IUmZJRWloTTBBc0xLQ0pDSGxMTkpyeVE0Q3dxRGFlTT0tLVZsSUtPeHFlSmk2REpWaThNVU51dWc9PQ%3D%3D--dea6944acc9967bd9a8005718f7299b559b12b94",
      },
    }
  );

  console.log(response.data);

  // const y = await axios.post(
  //   "https://api.thinkific.com/api/public/v1/courses/lessons",
  //   { name: "Test Lesson", course_id: 3330494 },
  //   ...headers
  // );
  // console.log(y);
}
// a();

// import puppeteer from "puppeteer";

// const browser = await puppeteer.launch({ headless: false });
// const page = await browser.newPage();

// // Login
// await page.goto("https://learn.vhalacha.com/users/sign_in");
// await page.type('input[name="user[email]"]', "virtualhalachaprogram@gmail.com");
// await page.type('input[name="user[password]"]', "RAVADAMVHP");
// await page.click('button[type="submit"]');
// await page.waitForNavigation();

// // Go to course editor - this should trigger graphql_token
// await page.goto("https://learn.vhalacha.com/manage/courses/3330494");
// await new Promise((r) => setTimeout(r, 5000)); // wait for JS to run

// const cookies = await page.cookies();
// console.log(cookies.map((c) => c.name));
// const thinkificSession = cookies.find((c) => c.name === "_thinkific_session");
// const graphqlToken = cookies.find((c) => c.name === "graphql_token");
// if (graphqlToken) {
//   console.log("GOT IT:", graphqlToken.value.substring(0, 50) + "...");
// }

// await browser.close();
// // Step 2: Create a chapter via GraphQL
// const response = await axios.post(
//   "https://learn.vhalacha.com/api/graphql",
//   {
//     operationName: "CreateChapter",
//     variables: {
//       name: "Chapter Created via API!",
//       setNewLessonsToDraft: false,
//       courseId: "Q291cnNlLTMzMzA0OTQ=",
//     },
//     query: `mutation CreateChapter($courseId: ID!, $name: String!, $position: Int, $setNewLessonsToDraft: Boolean) {
//       createChapter(input: {courseId: $courseId, position: $position, name: $name, setNewLessonsToDraft: $setNewLessonsToDraft}) {
//         chapter {
//           id
//           name
//           position
//         }
//         userErrors {
//           code
//           message
//         }
//       }
//     }`,
//   },
//   {
//     headers: {
//       "Content-Type": "application/json",
//       Cookie: `graphql_token=${graphqlToken.value}; _thinkific_session=${thinkificSession.value}`,
//     },
//   }
// );

// console.log(JSON.stringify(response.data, null, 2));

import puppeteer from "puppeteer";
const browser = await puppeteer.launch({
  headless: true,
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
  ],
});
const page = await browser.newPage();

// Login
await page.goto("https://learn.vhalacha.com/users/sign_in");
await page.type('input[name="user[email]"]', "virtualhalachaprogram@gmail.com");
await page.type('input[name="user[password]"]', "RAVADAMVHP");
await page.click('button[type="submit"]');
console.log("navigating from login page")
await page.waitForNavigation();
// Go to course page to get all tokens loaded
await page.goto("https://learn.vhalacha.com/manage/courses/3330494");
console.log("on course page")
await new Promise((r) => setTimeout(r, 3000));
// Execute GraphQL request from within the browser context
const result = await page.evaluate(async () => {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "CreateChapter",
      variables: {
        name: "Chapter Created via Puppeteer 2!",
        setNewLessonsToDraft: false,
        courseId: "Q291cnNlLTMzMzA0OTQ=",
      },
      query: `mutation CreateChapter($courseId: ID!, $name: String!, $position: Int, $setNewLessonsToDraft: Boolean) {
        createChapter(input: {courseId: $courseId, position: $position, name: $name, setNewLessonsToDraft: $setNewLessonsToDraft}) {
          chapter {
            id
            name
            position
          }
          userErrors {
            code
            message
          }
        }
      }`,
    }),
    credentials: "include",
  });
  return await response.json();
});

console.log(JSON.stringify(result, null, 2));

await browser.close();