// export async function uploadToThinkific(file, meta) {
//   console.log("Uploading:", file.name);
//   // implement Thinkific API here
// }

// const meta = parsePath(file.path, file.name);

// const courseId = await getOrCreateCourse(meta.course);
// const chapterId = await getOrCreateChapter(courseId, meta.chapter);

// const uploaded = await uploadFile({
//   accessToken,
//   folderId: rootFolderId,
//   fileName: file.name,
//   fileBuffer: file.buffer,
// });

// await createLesson(courseId, chapterId, meta.lessonName, uploaded.webUrl);

// export function parsePath(pathParts, filename) {
//   const [cycle, course, chapter] = pathParts;

//   return {
//     cycle,
//     course,
//     chapter,
//     lessonName: filename.toLowerCase().startsWith("e")
//       ? "Extra Maarei Mekomos"
//       : "Maarei Mekomos",
//   };
// }