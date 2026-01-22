// import { getThinkific, thinkific } from "./client.js";
import axios from "axios";

export async function getOrCreateCourse(name) {
  let data;
  try {
    ({ data } = await axios.get(
      "https://api.thinkific.com/api/public/v1/courses",
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
  let course = data.items.find((c) => c.name === name);
  // }catch(er){}
  if (!course) {
    let res;
    try {
      res = await axios.post(
        `https://api.thinkific.com/api/public/v1/courses`,
        { name },
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

    course = res.data;
  }

  return course.id;
}
