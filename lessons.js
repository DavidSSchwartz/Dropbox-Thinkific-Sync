import { thinkific } from "./client.js";

export async function createLesson(courseId, chapterId, title, fileUrl) {
  return thinkific.post(`/courses/${courseId}/lessons`, {
    chapter_id: chapterId,
    title,
    type: "pdf",
    file_url: fileUrl,
  });
}

