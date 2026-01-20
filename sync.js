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
    for (const entry of entries) {
      if (entry[".tag"] !== "file") continue;
      if (state.processedFiles.includes(entry.id)) continue; // skip duplicates

      console.log("Processing:", entry.name);

      // Download fixed
      const dropboxStream = await downloadFromDropbox(entry.path_lower);
      console.log({ dropboxStream, cursor });
      // Upload to Thinkific
      await uploadToThinkific(dropboxStream, entry.name);

      // Mark processed
      state.processedFiles.push(entry.id);
      saveState({ ...state, cursor }); // save after each file
    }

    // Save cursor if no files processed
    saveState({ ...state, cursor });
    console.log("Sync complete.");
  } catch (err) {
    console.error("Sync error:", err.message || err);
  }
}
