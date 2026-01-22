import { thinkific } from "./client.js";

export async function getOrCreateChapter(courseId, title) {
  const { data } = await thinkific.get(`/courses/${courseId}/chapters`);
  let chapter = data.items.find((c) => c.title === title);

  if (!chapter) {
    const res = await thinkific.post(`/courses/${courseId}/chapters`, {
      title,
    });
    chapter = res.data;
  }

  return chapter.id;
}
