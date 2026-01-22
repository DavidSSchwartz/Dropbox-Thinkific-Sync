// import { getThinkific, thinkific } from "./client.js";
import axios from "axios";

export async function getOrCreateCourse(name) {
  console.log(process.env.THINKIFIC_API_KEY);
  // return
  // try{
  const { data } = await axios.get(
    "https://api.thinkific.com/api/public/v1/courses",
    {
      headers: {
        "X-Auth-API-Key": process.env.THINKIFIC_API_KEY,
        "X-Auth-Subdomain": process.env.THINKIFIC_SUBDOMAIN,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  let course = data.items.find((c) => c.name === name);
  // }catch(er){}
  if (!course) {
    const res = await axios.post(
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

    course = res.data;
  }

  return course.id;
}
