export const isDevURL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://chattr.lol"
