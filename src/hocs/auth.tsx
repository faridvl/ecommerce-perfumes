import { GetServerSidePropsContext, GetServerSideProps } from 'next';
import { CookiesManager } from '@/shared/utils/cookies-manager';
import { routesPublic, routesPrivate } from '@/shared/navigation/routes';

type SSRCallback = (context: GetServerSidePropsContext, token: string) => Promise<any>;

/**
 * PROTEGIDO: Solo para Admin/Usuarios logueados.
 * Si no hay token, manda al Login.
 */
export function authorizeServerSidePage(callback?: SSRCallback): GetServerSideProps {
  return async (context: GetServerSidePropsContext) => {
    const token = CookiesManager.getAccessToken(context);

    if (!token) {
      return {
        redirect: {
          destination: routesPublic.login,
          permanent: false,
        },
      };
    }

    const additionalProps = callback ? await callback(context, token) : { props: {} };

    return {
      ...additionalProps,
      props: {
        ...(additionalProps.props || {}),
        userName: CookiesManager.getUserName(context) || null,
        isAuthenticated: true,
      },
    };
  };
}

/**
 * INVERSO: Solo para usuarios NO logueados (Login/Register).
 * Si ya hay token, manda al Dashboard.
 */
export function unauthorizeServerSidePage(): GetServerSideProps {
  return async (context: GetServerSidePropsContext) => {
    const token = CookiesManager.getAccessToken(context);

    if (token) {
      return {
        redirect: {
          destination: routesPrivate.admin.dashboard,
          permanent: false,
        },
      };
    }

    return { props: {} };
  };
}

/**
 * OPCIONAL: Para páginas públicas (Catálogo).
 * No redirige, pero detecta si hay una sesión activa para mostrar el nombre en el header.
 */
export function withOptionalAuth(callback?: SSRCallback): GetServerSideProps {
  return async (context: GetServerSidePropsContext) => {
    const token = CookiesManager.getAccessToken(context);

    const additionalProps = callback ? await callback(context, token || '') : { props: {} };

    return {
      ...additionalProps,
      props: {
        ...(additionalProps.props || {}),
        userName: token ? CookiesManager.getUserName(context) : null,
        isAuthenticated: !!token,
      },
    };
  };
}