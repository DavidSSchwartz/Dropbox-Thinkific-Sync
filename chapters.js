// import { thinkific } from "./client.js";
import axios from "axios";

export async function getOrCreateChapter(courseId, title) {
  let data;
  try {
    ({ data } = await axios.get(
      `https://api.thinkific.com/api/public/v1/courses/${courseId}/chapters`,
      {
        headers: {
          "X-Auth-API-Key": process.env.THINKIFIC_API_KEY,
          "X-Auth-Subdomain": process.env.THINKIFIC_SUBDOMAIN,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    ));
  } catch (err) {
    console.error(err);
  }
  let chapter = data.items.find((c) => c.title === title);

  if (!chapter) {
    let res;
    try {
       res = await axios.post(
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
    } catch (err) {
      console.error(err);
    }

    chapter = res.data;
  }

  return chapter.id;
}
