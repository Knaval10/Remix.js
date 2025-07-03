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
                                          ┌─────────────────────────────┐
                                          │    User opens browser       │
                                          └────────────┬────────────────┘
                                                       │
                                                       ▼
                                          (1) Browser requests a page:
                                              GET http://localhost:3000/
                                              Accept: text/html
                                                       │
                                                       ▼
                                          ┌─────────────────────────────────────────────────────┐
                                          │               Remix Dev Server (SSR)                │
                                          │ - Matches route (/)                                 │
                                          │ - Executes loader() for /                           │
                                          │ - Dynamically imports JSX route modules             │
                                          │   (via Vite’s SSR module loader)                    │
                                          │ - ReactDOMServer.renderToString() converts React   │
                                          │   components to a pre-rendered HTML string          │
                                          └─────────────────────────────┬───────────────────────┘
                                                                        │
                                          (2) Returns full HTML response including:
                                              - Pre-rendered HTML string
                                              - <script src="/build/entry.client.js">
                                              - <link href="/styles.css">
                                                                        │
                                                                        ▼
                                                             ┌─────────────────────┐
                                                             │      Browser        │
                                                             └────────┬────────────┘
                                                                      │
                                          (3) Parses HTML and requests assets from Vite:
                                              ├─ GET http://localhost:5173/build/entry.client.js
                                              └─ GET http://localhost:5173/styles.css
                                                                      │
                                                                      ▼
                                                         ┌───────────────────────────┐
                                                         │         Vite Dev          │
                                                         │ - Transpiles JSX to JS    │
                                                         │ - Serves JS and CSS       │
                                                         │ - Handles HMR             │
                                                         └─────────────┬─────────────┘
                                                                       │
                                          (4) JS loads in browser:
                                              React and RemixBrowser initialize
                                                                       │
                                          (5) React hydrates the SSR DOM:
                                              - Attaches event listeners
                                              - Enables SPA navigation and interactivity
                                                                       │
                                                                       ▼

                                          ───────────── CLIENT-SIDE NAVIGATION ─────────────

                                          (6) User clicks <Link to="/profile" />
                                                                       │
                                          (7) Remix client intercepts navigation and:
                                              ├─ Fetches JSON data from Remix server:
                                              │    fetch http://localhost:3000/profile
                                              │    Accept: application/json
                                              └─ Dynamically imports `/profile` JSX module chunk:
                                                   import("/build/routes/profile-XYZ.js") from Vite
                                                                       │
                                                                       ▼
                                          ┌─────────────────────────────────────────────────────┐
                                          │              Remix Dev Server (SPA mode)            │
                                          │ - Matches route (/profile)                          │
                                          │ - Executes loader() for /profile                    │
                                          │ - Returns JSON loader data                          │
                                          └───────────────┬─────────────────────────────────────┘
                                                          │
                                          (8) Remix JSON data returned to browser
                                                          │
                                          (9) Vite transpiles & serves JSX module chunk for `/profile` route
                                                          │
                                          (10) React receives JSX module + loader data
                                               → React renders the `/profile` route component
                                               → React reconciliation calculates minimal DOM updates
                                               → DOM updates and UI changes smoothly without full reload

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
