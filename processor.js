import { listNewFiles, downloadFile } from "./dropbox.js";
import { uploadToThinkific } from "./thinkific.js";

const processed = new Set(); // dedupe

export async function handleDropboxEvent() {
  console.log("Checking for new files...");

  const files = await listNewFiles();

  for (const entry of files) {
    if (processed.has(entry.id)) continue;

    processed.add(entry.id);

    console.log("New file:", entry.path_lower);

    const localPath = await downloadFile(entry);

    // 🔽 YOUR existing parsing logic here
    const parsed = parsePath(entry.path_lower);

    await uploadToThinkific({
      filePath: localPath,
      parsed
    });
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
    lessonName: parts[3]
  };
}

