import axios from "axios";

export const thinkific = axios.create({
  baseURL: "https://api.thinkific.com/api/public/v2",
  headers: {
    "X-Auth-API-Key": process.env.THINKIFIC_API_KEY,
    "X-Auth-Subdomain": process.env.THINKIFIC_SUBDOMAIN,
    "Content-Type": "application/json",
  },
});

// const BASE = `https://${process.env.THINKIFIC_SUBDOMAIN}.thinkific.com/api/public/v2`;
