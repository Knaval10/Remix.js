# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

# Documentation Summary

- File based routing # Places every view pages inside routes folder under app. root.tsx is the main file while all the files are imported
- Server Side Rendering # All the html are rendered in the server and loaded to browser. Hydration for adding interactivities to the rendered html
- Loaders and Actions # Loader for server-side data fetching before the component renders. Actions for server-side handling of form submissions or mutations
- Uses traditional <form> elements and GET/POST requests when possible
- Built-in error handlling # ErrorBoundary and CatchBoundry components are exported by each route # route-specific error boundaries
- No Client-Side Data Fetching by Default # All data fetching is server-rendered and sent to the client as JSON. #Removes the need for useEffect + fetch in
  most cases. # Great for performance and SEO. # Faster initial load and paint

# Data fetching comparison with traditional SPA

- Traditional SPA (React with useEffect):

  > Browser loads mostly empty HTML or a loading skeleton.
  > After page load, React’s useEffect triggers data fetching.
  > Data arrives asynchronously, then React updates the UI.
  > Initial load feels slower, SEO is weaker because crawlers see minimal content initially.

- Remix with loader():

  > Server runs the loader function before sending anything to the browser.
  > The server fetches the needed data.
  > Server renders your React component with real data included in the HTML.
  > Browser receives fully populated HTML and paints it immediately.
  > React hydrates the page to add interactivity.

# Why Use Remix?

- Great SEO by default (SSR and no client-side JS dependency).
- Simplified data fetching and mutations (loaders/actions).
- Fast by design (fine-grained control over caching and headers).
- First-class support for accessibility and progressive enhancement.

# When NOT to Use Remix?

- If you're building a purely static SPA without needing server rendering.
- If you're heavily invested in client-side data fetching libraries (like React Query).
- If your hosting does not support SSR or you're restricted to static files.

# Why Server-Side Data Fetching is Better for Large Data Volumes

1. Faster Time to First Paint (TTFP)

   - The server sends ready-to-render HTML with data already embedded.
   - No need to wait for React to load, then fetch, then render.
   - User sees the content immediately.

2. Reduced Client JS Load
   The browser doesn't have to:

   - Make another HTTP request
   - Handle large JSON blobs
   - Re-render after receiving data # This means less memory and CPU usage, especially on mobile devices.

3. Better SEO

   - Search engines can see the real content in the initial HTML.
   - No need for them to run JS to "see" your data.

4. Centralized Error Handling & Caching
   Fetching on the server lets you:

   - Use proper HTTP caching headers
   - Handle errors in loaders
   - Log and monitor performance

5. Security

   - You can keep tokens, secrets, or private endpoints hidden on the server.
   - No exposure to client-side attacks or misuse.

# Remix + Vite Dev Mode

1.  Vite

    - Vite acts as the frontend dev server
    - It handles:

      - Hot module reloading (HMR)
      - Serving React components (.jsx, .ts, etc.)
      - Transpiling frontend code
      - Fast updates for client-side code

2.  Remix Dev Server (Vite Plugin)

    - This is the Remix backend runtime in dev mode
    - It:

      - Runs your loader(), action() functions
      - Handles route matching and HTTP requests
      - Returns full HTML pages (SSR)
      - Acts like a minimal Express server

                                              # Simplified Process
                                             ┌────────────────────┐    SSR + Data Loaders
                                             │  Remix Dev Server  │ <────────────────────┐
                                             └────────┬───────────┘                      │
                                                      │ sends HTML (server-rendered)     │
                                                      ▼                                  │
                                                 ┌────────────┐                          │
                                                 │  Browser   │                          │
                                                 └────┬───────┘                          │
                                                      │ requests JS modules              │
                                                      ▼                                  │
                                                 ┌────────────┐                          │
                                                 │   Vite     │ ───> Serves JS, CSS, HMR │
                                                 └────────────┘


                                          # Detailed process
                                         ┌──────────────────────────────┐
                                         │     User opens the browser   │
                                         └────────────┬─────────────────┘
                                                      │
                                                      ▼
                                         (1) Browser sends request:
                                             GET http://localhost:3000/
                                             Accept: text/html
                                                      │
                                                      ▼
                                         ┌──────────────────────────────────────────────────────────┐
                                         │                Remix Dev Server (SSR Mode)               │
                                         │ - Matches route (e.g., "/")                              │
                                         │ - Dynamically imports matched route modules              │
                                         │ - Executes loader() for each matched route               │
                                         │ - Collects loader data                                   │
                                         │ - Creates remixContext                                   │
                                         │ - Builds JSX tree using <RemixServer />                  │
                                         │ - Calls ReactDOMServer.renderToString()                  │
                                         │ - Generates pre-rendered HTML string                     │
                                         │ - Injects:                                               │
                                         │     • window.__REMIX_DATA__ (loader data, manifest)      │
                                         │     • <script type="module" src="/entry.client.js">      │
                                         │     • <link href="/styles.css">                          │
                                         └──────────────────────────────┬───────────────────────────┘
                                                                        │
                                         (2) Server returns full HTML response
                                                                        │
                                                                        ▼
                                         ┌─────────────────────────────────────────────────────────────┐
                                         │                      Browser Receives HTML                  │
                                         │                                                             │
                                         │ (3a) Parses HTML and builds real DOM                        │
                                         │     - DOM tree created from SSR HTML                        │
                                         │     - Content is immediately painted                        │
                                         │                                                             │
                                         │ (3b) Requests JS & CSS assets                               │
                                         │     - GET /entry.client.js                                  │
                                         │     - GET /styles.css                                       │
                                         └─────────────────────────────────────────────────────────────┘
                                                                        │
                                                                        ▼
                                         ┌─────────────────────────────────────────────────────────────┐
                                         │                    Vite Dev Server (Dev Mode)               │
                                         │ - Serves JS chunks, transpiles JSX                          │
                                         │ - Supports HMR                                              │
                                         └──────────────────────────────┬──────────────────────────────┘
                                                                        │
                                         (4) JavaScript loads and runs:
                                             - entry.client.js calls hydrateRoot()
                                             - React initializes <RemixBrowser />
                                                                        │
                                                                        ▼
                                         ┌─────────────────────────────────────────────────────────────┐
                                         │                  Hydration Phase (React + Remix)            │
                                         │                                                             │
                                         │ (4a) React builds virtual DOM (vDOM)                        │
                                         │ (4b) React compares vDOM to real DOM                        │
                                         │                                                             │
                                         │ (4c) If vDOM matches real DOM:                              │
                                         │     - React attaches event listeners                        │
                                         │     - App becomes interactive                               │
                                         │                                                             │
                                         │ (4d) ❌ If vDOM does NOT match real DOM:                    │
                                         │     - React logs warning in console                         │
                                         │     - May replace mismatched DOM nodes                      │
                                         │     - Hydration partially fails or triggers re-render       │
                                         │     - App might behave unexpectedly or lose state           │
                                         └─────────────────────────────────────────────────────────────┘

                                         ─────────────── CLIENT-SIDE NAVIGATION ───────────────

                                         (5) User clicks <Link to="/profile" />
                                                                        │
                                         (6) Remix client intercepts navigation event:
                                             - Prevents full page reload
                                             - Matches route(s) for new URL (/profile)
                                             - Determines loaders to re-run & revalidation rules
                                                                        │
                                                                        ▼
                                         (7) Remix client requests route data & code:
                                             - Sends fetch() for loader JSON data:
                                               Accept: application/json
                                             - Dynamically imports route module JS chunk:
                                               import("/build/routes/profile-XYZ.js")
                                                                        │
                                                                        ▼
                                         ┌─────────────────────────────────────────────────────────────┐
                                         │                   Vite Dev Server (Dev Mode)                │
                                         │ - Receives JSX module request                                │
                                         │ - Transpiles JSX/TSX to JavaScript on-the-fly                │
                                         │ - Serves transpiled JS module chunk                          │
                                         └──────────────────────────────┬──────────────────────────────┘
                                                                        │
                                         (8) Remix Dev Server executes loader() for /profile route
                                             and returns JSON loader data
                                                                        │
                                                                        ▼
                                         (9) Browser receives:
                                             - Loader JSON data
                                             - Transpiled JS route module chunk
                                                                        │
                                                                        ▼
                                         (10) Remix client updates React state:
                                              - Injects loader data into component props
                                              - React reconciles vDOM with real DOM
                                              - Minimal DOM updates applied
                                                                        ▼
                                              ✅ New route rendered with SPA navigation without full page reload

# Folder Structure and Routing

- Folder based # Organized but not yet recommended # only considers the direct file
  app/
  ├── components/
  │ ├── ui/
  │ │ ├── Button.tsx
  │ │ └── Modal.tsx
  │ └── shared/
  │ ├── Header.tsx
  │ └── Footer.tsx
  ├── routes/
  │ ├── \_dashboard/
  │ │ ├── route.tsx
  │ │ ├── components/ # Dashboard-specific components
  │ │ │ └── DashboardNav.tsx
  │ │ └── index.tsx
  │ └── \_blog/
  │ ├── route.tsx
  │ └── index.tsx
  └── utils/
  └── db.server.ts

- Fully file and dot based # Recommended
  app/routes/
  ├── \_index.tsx #URL:/ #root or landing page
  ├── admin.tsx # admin layout
  ├── admin.\_index.tsx #URL:/admin # admin's dashboard
  ├── admin.employee.tsx # URL:/admin/employee
  ├── dashboard.tsx # URL: /dashboard
  ├── dashboard.settings.tsx # URL: /dashboard/settings
  ├── dashboard.profile.tsx # URL: /dashboard/profile
  ├── blog.tsx # URL: /blog
  ├── blog.posts.tsx # URL: /blog/posts
  ├── blog.categories.tsx # URL: /blog/categories
  ├── users.\_index.tsx # URL: /users (user list page)
  └── users.$userId.tsx # URL: /users/123 (user details with slug)

  Note: file name with (\_)prefix is not considered for path or url

## Development

Run the dev server:

```sh
yarn run dev
```

## Deployment

First, build your app for production:

```sh
yarn run build
```

Then run the app in production mode:

```sh
yarn start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `yarn run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
