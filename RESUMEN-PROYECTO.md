# Resumen del Proyecto Web — Peely Alimentos
*Última actualización: Abril 2025*

---

## ¿Qué hicimos?

Creamos el sitio web oficial de Peely Alimentos desde cero y lo publicamos en internet con dominio propio. El sitio muestra el catálogo de productos y tiene un formulario para recibir pedidos.

---

## El sitio web

**URL principal:** https://peelyalimentos.com

**URLs secundarias** (todas redirigen automáticamente a peelyalimentos.com):
- https://www.peelyalimentos.com
- https://peelyalimentos.com.ar
- https://peelyalimentos.online
- https://peelyalimentos.store

---

## ¿Dónde están los archivos?

Los archivos del sitio están guardados en tu computadora en:
```
Escritorio / Peely Foods / Website /
```

Dentro de esa carpeta están:
- **index.html** → Es la página web en sí. Contiene toda la estructura y el texto.
- **css/styles.css** → Define los colores, tipografías y el diseño visual.
- **js/main.js** → Controla las funciones interactivas (filtros, formulario, animaciones).
- **assets/images/** → Las imágenes del sitio (logo y foto hero).

---

## ¿Dónde está publicado?

El sitio funciona gracias a **dos servicios**:

### 1. GitHub
- Es como un "guardado en la nube" del código fuente.
- Cada vez que hacés cambios y los subís a GitHub, Vercel los publica automáticamente.
- Repositorio: https://github.com/lucaasmontenegro/peely-alimentos
- Usuario GitHub: **lucaasmontenegro**

### 2. Vercel
- Es el servicio que toma el código de GitHub y lo convierte en un sitio web real accesible desde internet.
- Es gratuito para proyectos como este.
- Panel de control: https://vercel.com/lucasmontenegro707-5345s-projects/peely-alimentos
- Usuario Vercel: **lucasmontenegro707** (cuenta asociada al email lucasmontenegro707@gmail.com)

---

## ¿Cómo funcionan los dominios?

Los dominios fueron comprados en **Donweb** y apuntan a Vercel a través de un registro DNS de tipo **A**.

El registro que se configuró en Donweb para cada dominio es:
- **Tipo:** A
- **Nombre:** @ (significa la raíz del dominio)
- **Contenido:** 76.76.21.21 (es la dirección IP de Vercel)
- **TTL:** 300

Esto le dice a internet: *"cuando alguien escriba peelyalimentos.com, llevalo a los servidores de Vercel"*.

---

## ¿Cómo actualizar el sitio en el futuro?

Si querés cambiar algo del sitio (un texto, un producto, una imagen, etc.):

1. Abrís el archivo correspondiente en tu computadora (generalmente `index.html`)
2. Hacés el cambio
3. Abrís la Terminal y escribís:
   ```
   cd "/Users/lucas/Desktop/Peely Foods/Website"
   vercel --prod
   ```
4. En 1-2 minutos el cambio aparece en vivo en peelyalimentos.com

---

## Formulario de pedidos

El formulario del sitio actualmente usa un **sistema de respaldo**: cuando alguien envía un pedido, abre tu cliente de correo con los datos ya completados.

Para que los pedidos lleguen directo a tu email **sin que el cliente tenga que usar su propio correo**, hay que completar un paso pendiente:

1. Entrar a https://formspree.io y crear una cuenta gratuita
2. Crear un nuevo formulario y copiar el ID (se ve así: `xpzgkrjq`)
3. Abrir el archivo `js/main.js` y en la línea que dice `YOUR_FORM_ID` reemplazarlo por ese ID

---

## Secciones del sitio

| Sección | Descripción |
|---|---|
| **Inicio** | Foto principal, slogan y botones de acción |
| **Productos** | Los 9 productos con filtro por categoría |
| **Recetas** | 4 recetas usando productos Peely |
| **Nosotros** | Historia y valores de la empresa |
| **Contacto** | Formulario de pedido |

---

## Datos importantes

| Cosa | Detalle |
|---|---|
| Colores de marca | Verde `#15733D` · Oscuro `#393939` · Gris `#6E6E6E` |
| Fuentes | Poppins (títulos) + Inter (texto) |
| Hosting | Vercel (gratuito) |
| Dominios | Donweb |
| Repositorio | GitHub — lucaasmontenegro/peely-alimentos |

---

*Documento generado con asistencia de Claude (Anthropic)*
