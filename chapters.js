// import { thinkific } from "./client.js";
import axios from "axios";

export async function getOrCreateChapter(courseId, title) {
  const { data } = await axios.get(
    `https://api.thinkific.com/api/public/v1/courses/${courseId}/chapters`,
    {
      headers: {
        "X-Auth-API-Key": process.env.THINKIFIC_API_KEY,
        "X-Auth-Subdomain": process.env.THINKIFIC_SUBDOMAIN,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  let chapter = data.items.find((c) => c.title === title);

  if (!chapter) {
    const res = await axios.post(
      `https://api.thinkific.com/api/public/v1/courses/${courseId}/chapters`,
      { title },
      {
        headers: {
          "X-Auth-API-Key": process.env.THINKIFIC_API_KEY,
          "X-Auth-Subdomain": process.env.THINKIFIC_SUBDOMAIN,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    chapter = res.data;
  }

  return chapter.id;
}
