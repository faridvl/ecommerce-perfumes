# Audit: Features Incompletas y Pendientes

---

## Páginas vacías / shell

### Admin — Clientes (`/admin/customers`)
**Archivo**: `src/pages/admin/customers/index.tsx`  
**Estado**: Página vacía, solo layout.  
**Propuesta de implementación**:
- Extraer clientes únicos de la tabla `orders` (customer_name + customer_whatsapp)
- Mostrar: nombre, WhatsApp, nº de pedidos, total gastado
- No requiere tabla nueva en DB (consulta sobre `orders`)

### Admin — Ajustes (`/admin/settings`)
**Archivo**: `src/pages/admin/settings/index.tsx`  
**Estado**: Página vacía.  
**Propuesta**: Configuración del negocio (nombre, datos de pago SINPE/IBAN) editable desde UI en lugar de env vars.

---

## Features incompletas en código

### Dashboard con datos reales
**Archivo**: `src/pages/admin/dashboard/index.tsx`  
**Estado**: Stats hardcodeados, gráfico placeholder.  
Ver [features/admin-dashboard.md](../features/admin-dashboard.md) para el plan de implementación.

### Recuperación de contraseña
**Archivo**: `src/shared/api/mutations/auth/use-forgot-password-mutation.ts`  
**Estado**: Mutation existe como stub, sin lógica de backend.  
**Requiere**: Endpoint de email (SendGrid, Resend, etc.) no configurado.

### Registro de usuarios admin
**Archivo**: `src/shared/api/mutations/auth/use-register-mutation.ts`  
**Estado**: Mutation existe como stub.  
**Estado actual**: Usuarios admin solo se pueden crear directo en DB.

---

## TODOs en código fuente

| Archivo | TODO |
|---------|------|
| `src/components/common/custom-icon/custom-icon.tsx` | Agregar Hero Icons según se necesiten |
| `src/components/common/custom-icon/custom-icon.tsx` | Agregar text-colors al tailwind config |
| `src/components/common/table/pagination.tsx` | Mover al contexto de paginación |
| `src/pages/_app.tsx` | Soporte favicon dark/light SVG adaptable |
| `src/pages/_app.tsx` | Cambiar dinámicamente si se implementa light mode |
| `src/pages/_app.tsx` | Agregar OpenGraph y Twitter meta tags |
| `src/pages/_document.tsx` | Soporte favicon dark/light dinámico |
| `src/pages/_document.tsx` | Cargar Poppins/Inter desde Google Fonts si se usa |

---

## Features deseables post-MVP

En orden de valor de negocio estimado:

| Feature | Complejidad | Valor |
|---------|-------------|-------|
| Notificaciones email al crear pedido | Media | Alto |
| Dashboard con métricas reales | Media | Alto |
| Gestión de clientes (lista + historial) | Baja | Medio |
| Reportes de ventas por período | Alta | Medio |
| Integración pasarela de pago (SINPE auto / Stripe) | Alta | Alto |
| Wishlist / favoritos | Media | Medio |
| Reseñas de productos | Media | Medio |
| Gestión de marcas independiente | Baja | Bajo |
| Descuentos y cupones | Alta | Medio |
| Tracking de envíos (link Correos CR) | Baja | Medio |
| Roles diferenciados admin vs staff | Media | Bajo |
| Modo oscuro | Baja | Bajo |
| SEO: OpenGraph, Twitter cards | Baja | Medio |

---

## Variables de entorno no documentadas en `.env.example`

No existe un `.env.example` en el repo. Las variables requeridas son:

```bash
ECOMMERCE_DB_POSTGRES_URL=
JWT_SECRET=
NEXT_PUBLIC_SINPE_NUMBER=
NEXT_PUBLIC_SINPE_OWNER=
NEXT_PUBLIC_IBAN=
NEXT_PUBLIC_WHATSAPP_BUSINESS=
NEXT_PUBLIC_AUTH_API_URL=
NEXT_PUBLIC_CATALOG_API_URL=
```

**Recomendación**: Crear `.env.example` con estas variables vacías y hacer commit.
