import axios from "axios";
import fs from "fs";
import path from "path";

const DROPBOX_API = "https://api.dropboxapi.com/2";
const DROPBOX_CONTENT = "https://content.dropboxapi.com/2";

let cursor = null; // simple in-memory cursor (fine for v1)

export async function listNewFiles() {
  let response;

  if (!cursor) {
    response = await axios.post(
      `${DROPBOX_API}/files/list_folder`,
      {
        path: "",
        recursive: true,
      },
      authHeaders()
    );
  } else {
    response = await axios.post(
      `${DROPBOX_API}/files/list_folder/continue`,
      { cursor },
      authHeaders()
    );
  }

  cursor = response.data.cursor;

  return response.data.entries.filter((e) => e[".tag"] === "file");
}

export async function downloadFile(entry) {
  const localPath = path.join("/tmp", path.basename(entry.path_lower));

  const res = await axios.post(
    `${DROPBOX_CONTENT}/files/download`,
    undefined, // 🚨 IMPORTANT: NOT null
    {
      headers: {
        ...authHeaders().headers,
        "Dropbox-API-Arg": JSON.stringify({
          path: entry.path_lower,
        }),
        // 🚫 DO NOT set Content-Type
      },
      responseType: "stream",
    }
  );
console.log("Downloading:", entry.path_lower);

  await new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(localPath);
    res.data.pipe(stream);
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return localPath;
}

function authHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
    },
  };
}
