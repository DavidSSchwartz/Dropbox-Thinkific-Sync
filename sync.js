import fs from "fs";
import path from "path";
import axios from "axios";
import { downloadFromDropbox } from "./dropbox.js";
import { uploadToThinkific } from "./thinkific.js";

const STATE_FILE = path.resolve("./state.json");

// Load state
export function loadState() {
  if (!fs.existsSync(STATE_FILE)) {
    return { cursor: null, processedFiles: [] };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
}

// Save state
export function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// Main sync loop
export async function syncDropboxFolder() {
  const state = loadState();
  let entries = [];
  let cursor = state.cursor;

  try {
    if (!cursor) {
      // First time
      const res = await axios.post(
        "https://api.dropboxapi.com/2/files/list_folder",
        { path: "" },
        {
          headers: {
            Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      entries = res.data.entries;
      cursor = res.data.cursor;
    } else {
      // Continue from cursor
      const res = await axios.post(
        "https://api.dropboxapi.com/2/files/list_folder/continue",
        { cursor },
        {
          headers: {
            Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      entries = res.data.entries;
      cursor = res.data.cursor;
    }
    console.log({ entries });
    await processEntries(entries, state);
    console.log("Sync complete.");
  } catch (err) {
    console.error("Sync error:", err.message || err);
  }
}

async function processEntries(entries, state) {
  for (const entry of entries) {
    if (entry[".tag"] === "folder") {
      // Recursively list folder contents
      const res = await axios.post(
        "https://api.dropboxapi.com/2/files/list_folder",
        { path: entry.path_lower },
        {
          headers: {
            Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      await processEntries(res.data.entries, state); // recursion
      continue;
    }

    if (entry[".tag"] === "file") {
      if (state.processedFiles.includes(entry.id)) continue;

      console.log("Processing file:", entry.name);

      const dropboxStream = await downloadFromDropbox(entry.path_lower);
       const parsed = parsePath(entry.path_lower);
      await uploadToThinkific(dropboxStream, parsed);

      state.processedFiles.push(entry.id);
      saveState({ ...state, cursor: state.cursor });
    }
  }
}
function parsePath(path) {
  /**
   * Example:
   * /Cycle 1/Course A/Chapter 3/Lesson.pdf
   */
  const parts = path.split("/").filter(Boolean);

  return {
    cycle: parts[0],
    course: parts[1],
    chapter: parts[2],
    lessonName: parts[3],
  };
}
