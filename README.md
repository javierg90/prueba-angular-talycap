# Prueba Angular – Talycap (Angular 20 + SSR + Material)

Aplicación de ejemplo con **Angular 20**, **Standalone Components**, **Angular Material 20 (MDC)** y **Server-Side Rendering (SSR)**.  
Muestra dos tablas (Películas y Clima) con **búsqueda**, **paginación** y **ordenamiento** al hacer clic en la cabecera.

---

## 🚀 Requisitos previos

- **Node.js** LTS (≥18.19 o 20.x)
- (Opcional) **Angular CLI** 20:
  ```bash
  npm i -g @angular/cli@^20
  ```

---

## 📦 Instalación

1. Clonar o descargar este repositorio:

   ```bash
   git clone https://github.com/javierg90/prueba-angular-talycap
   cd prueba-angular-talycap
   ```

2. Instalar dependencias:
   ```bash
   npm i
   ```

---

## 🔑 Configuración de entornos (API Keys)

La app consume **TMDB** (películas) y **OpenWeather** (clima). Configura tus llaves en:

- `src/environments/environment.development.ts` (desarrollo)
- `src/environments/environment.ts` (producción)

Ejemplo:

```ts
export const environment = {
  production: false,
  tmdb: {
    apiUrl: 'https://api.themoviedb.org/3',
    apiKey: 'aa530053e6afba40bb49919cb03127fc',
    imageBase: 'https://image.tmdb.org/t/p/w200',
  },
  openWeather: {
    apiUrl: 'https://api.openweathermap.org/data/2.5',
    apiKey: '9b45e5df2919c27e8910667fa267aabe',
    units: 'metric',
    iconBase: 'https://openweathermap.org/img/wn',
  },
};
```

---

## 📝 Scripts disponibles

En `package.json`:

| Script                                     | Descripción                                                                                     |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `npm start`                                | Levanta la app en **modo desarrollo** (Angular CLI, render en navegador).                       |
| `npm run build`                            | Construye la app (browser + server para SSR).                                                   |
| `npm run watch`                            | Compila en modo watch (sin servidor).                                                           |
| `npm test`                                 | Ejecuta las **pruebas unitarias** (Jasmine + Karma).                                            |
| `npm run serve:ssr:prueba-angular-talycap` | Inicia el **servidor SSR** en producción desde `dist/prueba-angular-talycap/server/server.mjs`. |

---

## 🖥️ Ejecución en desarrollo (sin SSR)

```bash
npm start
```

Por defecto: <http://localhost:4200>  
Ideal para iterar UI rápido.

---

## 🌐 Ejecución SSR (producción)

1. Compilar:
   ```bash
   npm run build
   ```
2. Servir SSR:
   ```bash
   npm run serve:ssr:prueba-angular-talycap
   ```

Por defecto se sirve en **http://localhost:4000** (puerto configurable con `PORT=5000 npm run serve:ssr:prueba-angular-talycap`).  
La respuesta inicial ya viene **renderizada desde el servidor** y luego el cliente hidrata.

---

## 🧪 Pruebas unitarias

```bash
npm test
```

Ejecuta las pruebas en modo interactivo (Jasmine + Karma). Para correr una sola vez en headless:

```bash
ng test --no-watch --no-progress --browsers=ChromeHeadless
```

Hay specs para **MoviesService** y **WeatherService** usando `HttpClientTestingModule` y `HttpTestingController`.

---

## 🛠️ Stack técnico

- **Angular 20** + **Standalone Components**
- **@angular/ssr** con **hidratación** y **Transfer Cache**
- **Angular Material 20 (MDC)** para tablas, paginación, sort y búsqueda
- **HttpClient con Fetch** (SSR-friendly)
- **Pruebas** con Jasmine + Karma y utilitarios de testing HTTP
- **Tema Material 2025** definido en `styles.scss`

---
