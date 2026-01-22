import { getOrCreateCourse } from "./courses.js";
import { getOrCreateChapter } from "./chapters.js";
import { createLesson } from "./lessons.js";

export async function uploadToThinkific({ filePath, parsed }) {
  const courseId = await getOrCreateCourse(parsed.course);
  const chapterId = await getOrCreateChapter(courseId, parsed.chapter);

  await createLesson(courseId, chapterId, parsed.lessonName, filePath);

  console.log("Uploading to Thinkific:", parsed);

  return true;
}