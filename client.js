// import axios from "axios";

// export const thinkific = axios.create({
//   baseURL: "https://api.thinkific.com/api/public/v1",
//   headers: {
//     // Authorization: `Bearer ${process.env.THINKIFIC_API_KEY}`,
//     "X-Auth-API-Key": process.env.THINKIFIC_API_KEY, // Not Authorization: Bearer
//     "X-Auth-Subdomain": process.env.THINKIFIC_SUBDOMAIN,
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
//   timeout: 10000,
// });

// let _thinkific = null;

// export const getThinkific = () => {
//   if (!_thinkific) {
//     _thinkific = axios.create({
//       baseURL: "https://api.thinkific.com/api/public/v1",
//       headers: {
//         "X-Auth-API-Key": process.env.THINKIFIC_API_KEY,
//         "X-Auth-Subdomain": process.env.THINKIFIC_SUBDOMAIN,
//         // Accept: "application/json",
//         // "Content-Type": "application/json",
//       },
//       timeout: 10000,
//     });
//   }
//   _thinkific.interceptors.request.use((config) => {
//     console.log("Full URL:", config.baseURL + config.url);
//     console.log("Headers:", JSON.stringify(config.headers, null, 2));
//     return config;
//   });
//   return _thinkific;
// };


// // const BASE = `https://${process.env.THINKIFIC_SUBDOMAIN}.thinkific.com/api/public/v2`;
// // async function a() {
// //   console.log(process.env.THINKIFIC_API_KEY);
// //   let c = await axios.get("https://api.thinkific.com/api/public/v1/courses", {
// //     headers: {
// //       Authorization: `Bearer ${process.env.THINKIFIC_API_KEY}`,
// //       Accept: "application/json",
// //       "X-Auth-Subdomain": process.env.THINKIFIC_SUBDOMAIN, // Add this!
// //     },
// //   });
// //   console.log(c);
// // }
// // a();