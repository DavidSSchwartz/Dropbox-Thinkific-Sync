// import { listNewFiles, downloadFile } from "./dropbox.js";
// import { uploadToThinkific } from "./thinkific.js";

// const processed = new Set(); // dedupe

// export async function handleDropboxEvent() {
//   console.log("Checking for new files...");

//   const files = await listNewFiles();

//   for (const entry of files) {
//     if (processed.has(entry.id)) continue;

//     processed.add(entry.id);

//     console.log("New file:", entry.path_lower);

//     const localPath = await downloadFile(entry);

//     // 🔽 YOUR existing parsing logic here
//     const parsed = parsePath(entry.path_lower);

//     await uploadToThinkific({
//       filePath: localPath,
//       parsed
//     });
//   }
// }

// function parsePath(path) {
//   /**
//    * Example:
//    * /Cycle 1/Course A/Chapter 3/Lesson.pdf
//    */
//   const parts = path.split("/").filter(Boolean);

//   return {
//     cycle: parts[0],
//     course: parts[1],
//     chapter: parts[2],
//     lessonName: parts[3]
//   };
// }

import fs from "fs";
import path from "path";
import { listNewFiles, downloadFile } from "./dropbox.js";
import { uploadToThinkific } from "./thinkific.js";

const STATE_FILE = path.resolve("./state.json");

// auto-load or create state
function loadState() {
  if (!fs.existsSync(STATE_FILE)) {
    const initialState = { cursor: null, processedFiles: [] };
    fs.writeFileSync(STATE_FILE, JSON.stringify(initialState, null, 2));
    return initialState;
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export async function handleDropboxEvent() {
  console.log("Checking for new files...");
  const state = loadState();

  const { files, cursor } = await listNewFiles(state.cursor);

  for (const entry of files) {
    if (state.processedFiles.includes(entry.id)) continue;

    console.log("New file:", entry.path_lower);

    const localPath = await downloadFile(entry);

    // keep your parsing logic
    const parsed = parsePath(entry.path_lower);

    await uploadToThinkific({
      filePath: localPath,
      parsed,
    });

    // mark processed and save
    state.processedFiles.push(entry.id);
    saveState({ ...state, cursor });
  }

  saveState({ ...state, cursor });
}

function parsePath(pathStr) {
  const parts = pathStr.split("/").filter(Boolean);
  return {
    cycle: parts[0],
    course: parts[1],
    chapter: parts[2],
    lessonName: parts[3],
  };
}
