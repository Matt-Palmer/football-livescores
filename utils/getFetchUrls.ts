export const getFetchUrl = (route: string) => {
  let base_url = `https://${process.env.VERCEL_URL}`
  // let base_url = `http://localhost:3000`

  return `/${route}`;
};
