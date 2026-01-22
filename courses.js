import { thinkific } from "./client.js";

export async function getOrCreateCourse(name) {
  const { data } = await thinkific.get("/courses");
  let course = data.items.find((c) => c.name === name);

  if (!course) {
    const res = await thinkific.post("/courses", { name });
    course = res.data;
  }

  return course.id;
}
