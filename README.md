
  # Sistema de Reservas de Sala

  This is a code bundle for Sistema de Reservas de Sala. The original project is available at https://www.figma.com/design/Ii50GcELGhfOWFleCVr9Pi/Sistema-de-Reservas-de-Sala.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server (available at `http://localhost:3000`).

  ## Backend (Node + Express)

  The backend lives in the `backend/` directory and provides mock APIs that mirror the current frontend data.

  ```bash
  cd backend
  npm install
  npm run dev
  ```

  The server listens on port `3333` by default. Update environment variables in `backend/.env` (create from `.env.example` if needed).

  ## Frontend API configuration

  The frontend expects the backend API URL to be available through the `VITE_API_BASE_URL` variable. Duplicate the `.env.example` file at the project root and adjust the value if required:

  ```bash
  cp .env.example .env
  # edit .env if the backend runs on a different host/port
  ```

  When both servers are running (`npm run dev` in the root and `npm run dev` inside `backend/`), the login screen will authenticate against the API and the dashboard data will sync from the backend.
  