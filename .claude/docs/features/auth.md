# Feature: Autenticación

## Estado: Funcional ✅ (solo admin)

---

## Archivos

| Archivo | Responsabilidad |
|---------|----------------|
| `src/pages/login/index.tsx` | Página de login |
| `src/components/containers/login/login-container.tsx` | Formulario de login |
| `src/pages/api/auth/login.ts` | POST login → JWT |
| `src/pages/api/auth/me.ts` | GET usuario actual |
| `src/shared/api/services/auth.service.ts` | login, verifyToken, getUserFromToken |
| `src/shared/api/repositories/auth.repo.ts` | findByEmail |
| `src/shared/api/api-auth.ts` | Helpers: getTokenFromRequest, getCartSessionId |
| `src/shared/utils/cookies-manager.ts` | Persistencia de token y nombre en cookie |
| `src/hooks/use-session.ts` | Hook: estado de sesión en cliente |
| `src/hooks/use-logout.ts` | Hook: limpiar sesión y redirigir |
| `src/hocs/auth.tsx` | `authorizeServerSidePage()` para proteger páginas |

---

## Flujo de autenticación

```
1. Admin va a /login
2. Llena email + contraseña
3. POST /api/auth/login
   a. AuthRepo.findByEmail(email)
   b. bcrypt.compare(password, user.password_hash)
   c. jwt.sign({ userId: user.uuid, email }, JWT_SECRET, { expiresIn: '1h' })
4. Token se guarda en cookie (1 hora)
5. Redirige a /admin/dashboard
6. Cada página admin tiene getServerSideProps con authorizeServerSidePage()
   que verifica el token y redirige si expiró
```

---

## `authorizeServerSidePage()`

HOC de servidor que:
1. Lee cookie del request
2. Verifica JWT con `AuthService.verifyToken(token)`
3. Si válido: continua con `props: {}`
4. Si inválido/ausente: `redirect: { destination: '/login' }`

**Bug conocido**: `pages/admin/dashboard/index.tsx` tiene el `getServerSideProps` comentado → NO protegido.

---

## `getTokenFromRequest(request)`

Helper en `src/shared/api/api-auth.ts` que extrae el Bearer token del header `Authorization`.  
Usado en todos los API routes que requieren auth admin.

---

## `getCartSessionId(request)`

Helper que lee la cookie `CART_SESSION_ID`.  
Usado en API routes del carrito y checkout.

---

## Tipos

```ts
// src/types/auth/auth.ts
interface User { id: number; uuid: string; email: string; full_name: string; role: string; }
interface LoginCredentials { email: string; password: string; }
interface LoginResponse { token: string; user: User; }
```

---

## Seguridad

- Contraseñas: bcrypt (server-side)
- JWT: firmado con `JWT_SECRET` (env var, nunca expuesta al cliente)
- Cookies: `httpOnly: true`, `secure: true` en producción, `sameSite: 'lax'`
- No hay refresh token — la sesión expira en 1 hora sin renovación

---

## i18n Keys usadas

```
login.title / subtitle
login.email_label / email_placeholder
login.password_label / password_placeholder
login.submit / submitting / error_invalid
login.validation_email_required / validation_email_valid / validation_password_required
```

---

## Lo que NO existe (no implementado)

- Registro de admin desde UI (solo se puede crear usuarios manualmente en DB)
- Recuperación de contraseña (mutation existe como stub pero no tiene lógica)
- Roles diferenciados en UI (todos los usuarios autenticados tienen acceso total)
- Sesiones de clientes (el carrito es anónimo por session cookie)
