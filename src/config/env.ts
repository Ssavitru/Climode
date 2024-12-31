export const env = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://climode.net",
  isProd: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV === "development",
};
