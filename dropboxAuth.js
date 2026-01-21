import axios from "axios";

export async function getDropboxAccessToken() {
  // If we already refreshed during this run, reuse it
  if (global.__DROPBOX_TOKEN__) {
    return global.__DROPBOX_TOKEN__;
  }

  const res = await axios.post(
    "https://api.dropboxapi.com/oauth2/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.DROPBOX_REFRESH_TOKEN,
    }),
    {
      auth: {
        username: process.env.DROPBOX_APP_KEY,
        password: process.env.DROPBOX_APP_SECRET,
      },
    }
  );

  global.__DROPBOX_TOKEN__ = res.data.access_token;
  return res.data.access_token;
}
