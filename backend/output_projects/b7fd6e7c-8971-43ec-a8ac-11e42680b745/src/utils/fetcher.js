import fetch from 'node-fetch';

export default async function fetcher(url) {
  const response = await fetch(url);
  return response;
}