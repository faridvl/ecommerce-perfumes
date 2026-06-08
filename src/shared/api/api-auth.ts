import type { NextApiRequest } from 'next';

const SESSION_TOKEN_KEY = 'SESSION_ACCESS_TOKEN';
const CART_SESSION_COOKIE = 'CART_SESSION_ID';

export function getTokenFromRequest(request: NextApiRequest): string | undefined {
  const authorizationHeader = request.headers.authorization;
  if (authorizationHeader?.startsWith('Bearer ')) return authorizationHeader.slice(7);

  if (request.headers.cookie) {
    const parsedCookies = Object.fromEntries(
      request.headers.cookie.split('; ').map((cookieEntry) => {
        const [cookieName, ...cookieValue] = cookieEntry.split('=');
        return [cookieName.trim(), cookieValue.join('=')];
      }),
    );
    return parsedCookies[SESSION_TOKEN_KEY];
  }

  return undefined;
}

export function getCartSessionId(request: NextApiRequest): string | undefined {
  if (!request.headers.cookie) return undefined;

  const parsedCookies = Object.fromEntries(
    request.headers.cookie.split('; ').map((cookieEntry) => {
      const [cookieName, ...cookieValue] = cookieEntry.split('=');
      return [cookieName.trim(), cookieValue.join('=')];
    }),
  );

  return parsedCookies[CART_SESSION_COOKIE];
}
