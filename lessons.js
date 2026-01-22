// import { thinkific } from "./client.js";
import axios from "axios";

export async function createLesson(courseId, chapterId, title, fileUrl) {
  try {
    return await axios.post(
      `https://api.thinkific.com/api/public/v1/courses/${courseId}/lessons`,
      {
        chapter_id: chapterId,
        title,
        type: "pdf",
        file_url: fileUrl,
      },
      {
        headers: {
          "X-Auth-API-Key": process.env.THINKIFIC_API_KEY,
          "X-Auth-Subdomain": process.env.THINKIFIC_SUBDOMAIN,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error(err);
  }
}
