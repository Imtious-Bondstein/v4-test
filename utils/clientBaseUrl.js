import dotenv from "dotenv";
dotenv.config();
export const clientBaseUrl = (url) => {
  if (url === "localhost") {
    return "http://localhost:3000";
  } else {
    return process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
  }
};
