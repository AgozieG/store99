async function request(method, path, body) {
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let data = null;
  let responseText = '';
  try {
    responseText = await response.text();
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    // Some hosting errors are returned as plain text rather than JSON.
  }

  if (!response.ok) {
    throw new Error(data?.message || responseText || `Request failed with status ${response.status}.`);
  }

  return { data };
}

export const api = {
  get(path) {
    return request('GET', path);
  },
  post(path, body) {
    return request('POST', path, body);
  },
};
