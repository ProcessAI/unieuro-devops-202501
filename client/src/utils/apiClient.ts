import Cookies from 'js-cookie';

export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const token = Cookies.get('accessToken') || '';

  const headers = new Headers(init?.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    const refreshResponse = await fetch('/api/refresh-token', {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshResponse.ok) {
      const data = (await refreshResponse.json()) as { accessToken: string };
      const newToken = data.accessToken;

      Cookies.set('accessToken', newToken, { expires: 2 / 1440 });

      const retryHeaders = new Headers(init?.headers || {});
      retryHeaders.set('Authorization', `Bearer ${newToken}`);

      response = await fetch(input, {
        ...init,
        headers: retryHeaders,
        credentials: 'include',
      });
      return response;
    }

    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    window.location.href = '/login';
    return response;
  }

  return response;
}
