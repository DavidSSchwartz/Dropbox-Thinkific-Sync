// // import axios from "axios";
// // import fs from "fs";
// // import path from "path";

// // const DROPBOX_API = "https://api.dropboxapi.com/2";
// // const DROPBOX_CONTENT = "https://content.dropboxapi.com/2";

// // let cursor = null; // simple in-memory cursor (fine for v1)

// // export async function listNewFiles() {
// //   let response;

// //   if (!cursor) {
// //     response = await axios.post(
// //       `${DROPBOX_API}/files/list_folder`,
// //       {
// //         path: "",
// //         recursive: true,
// //       },
// //       authHeaders()
// //     );
// //   } else {
// //     response = await axios.post(
// //       `${DROPBOX_API}/files/list_folder/continue`,
// //       { cursor },
// //       authHeaders()
// //     );
// //   }

// //   cursor = response.data.cursor;

// //   return response.data.entries.filter((e) => e[".tag"] === "file");
// // }

// // export async function downloadFile(entry) {
// //   const localPath = path.join("/tmp", path.basename(entry.path_lower));

// //   // const res = await axios.post(
// //   //   `${DROPBOX_CONTENT}/files/download`,
// //   //   undefined, // 🚨 IMPORTANT: NOT null
// //   //   {
// //   //     headers: {
// //   //       ...authHeaders().headers,
// //   //       "Dropbox-API-Arg": JSON.stringify({
// //   //         path: entry.path_lower,
// //   //       }),
// //   //       // 🚫 DO NOT set Content-Type
// //   //     },
// //   //     responseType: "stream",
// //   //   }
// //   // );
// //   console.log("Downloading:", entry.path_lower);
// //   try {
// //     const res = await axios({
// //       method: "post",
// //       url: `${DROPBOX_CONTENT}/files/download`,
// //       responseType: "stream",
// //       headers: {
// //         Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
// //         "Content-Type": "application/octet-stream",
// //         "Dropbox-API-Arg": JSON.stringify({
// //           path: entry.path_lower,
// //         }),
// //       },
// //       data: null,
// //     });

// //     await new Promise((resolve, reject) => {
// //       const stream = fs.createWriteStream(localPath);
// //       res.data.pipe(stream);
// //       stream.on("finish", resolve);
// //       stream.on("error", reject);
// //     });
// //   } catch (err) {
// //     if (err.response?.data) {
// //       err.response.data.on("data", (chunk) => {
// //         console.error(chunk.toString());
// //       });
// //     } else {
// //       console.error(err.message);
// //     }
// //   }
// //   return localPath;
// // }

// // function authHeaders() {
// //   return {
// //     headers: {
// //       Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
// //     },
// //   };
// // }

// // //////
// import axios from "axios";

// export async function downloadFromDropbox(path) {
//   return axios.request({
//     method: "post",
//     url: "https://content.dropboxapi.com/2/files/download",
//     responseType: "stream",
//     headers: {
//       Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
//       "Dropbox-API-Arg": JSON.stringify({ path }),
//       "Content-Type": "application/octet-stream", // ✅ fixed
//     },
//     data: "", // ✅ empty string prevents Axios auto-headers
//     transformRequest: [(data) => data], // prevents Axios from changing it
//   });
// }
import axios from "axios";
import fs from "fs";
import path from "path";
import { getDropboxAccessToken } from "./dropboxAuth.js";

const LOCAL_DOWNLOAD_DIR = path.resolve("./downloads");
if (!fs.existsSync(LOCAL_DOWNLOAD_DIR)) fs.mkdirSync(LOCAL_DOWNLOAD_DIR);

export async function listNewFiles(cursor) {
  let res;
  const token = await getDropboxAccessToken();

  if (!cursor) {
    res = await axios.post(
      "https://api.dropboxapi.com/2/files/list_folder",
      { path: "", recursive: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } else {
    res = await axios.post(
      "https://api.dropboxapi.com/2/files/list_folder/continue",
      { cursor },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  const files = res.data.entries.filter((e) => e[".tag"] === "file");
  return { files, cursor: res.data.cursor };
}

export async function downloadFile(entry) {
  const localPath = path.join(
    LOCAL_DOWNLOAD_DIR,
    path.basename(entry.path_lower)
  );
  const token = await getDropboxAccessToken();

  const res = await axios.request({
    method: "post",
    url: "https://content.dropboxapi.com/2/files/download",
    responseType: "stream",
    headers: {
      Authorization: `Bearer ${token}`,
      "Dropbox-API-Arg": JSON.stringify({ path: entry.path_lower }),
      "Content-Type": "application/octet-stream",
    },
    data: "",
  });

  const writer = fs.createWriteStream(localPath);
  res.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(localPath));
    writer.on("error", reject);
  });
}

const STATE_PATH = "/sync-state/state.json"; // dedicated folder in Dropbox

export async function downloadState() {
  const token = await getDropboxAccessToken();

  try {
    const res = await axios({
      method: "post",
      url: "https://content.dropboxapi.com/2/files/download",
      responseType: "json",
      headers: {
        Authorization: `Bearer ${token}`,
        "Dropbox-API-Arg": JSON.stringify({ path: STATE_PATH }),
        "Content-Type": "application/octet-stream",
      },
    });
    return res.data;
  } catch (err) {
    // file not found → return empty initial state
    return { cursor: null, processedFiles: [] };
  }
}

export async function uploadState(state) {
  const token = await getDropboxAccessToken();

  await axios({
    method: "post",
    url: "https://content.dropboxapi.com/2/files/upload",
    headers: {
      Authorization: `Bearer ${token}`,
      "Dropbox-API-Arg": JSON.stringify({
        path: STATE_PATH,
        mode: "overwrite",
        autorename: false,
        mute: true,
      }),
      "Content-Type": "application/octet-stream",
    },
    data: JSON.stringify(state),
  });
}
