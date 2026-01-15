import axios from "axios";

const BASE = `https://${process.env.THINKIFIC_SUBDOMAIN}.thinkific.com/api/public/v2`;

export async function uploadToThinkific({ filePath, parsed }) {
  /**
   * You already have this logic.
   * This function should:
   * - ensure chapter exists
   * - create lesson
   * - upload PDF
   */

  console.log("Uploading to Thinkific:", parsed);

  // placeholder
  return true;
}

