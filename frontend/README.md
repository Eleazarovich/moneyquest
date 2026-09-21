# MoneyQuest frontend

The frontend is a Next.js 15 application with TypeScript and Tailwind CSS. It provides the interactive MoneyQuest experience: the landing page, payslip reveal, monthly simulation, financial-health view, year-in-money summary, what-if comparisons, and replay flow.

The main project documentation is in the [repository README](../README.md).

## Run locally

Start the Spring Boot backend first from `backend/`:

```bash
./mvnw spring-boot:run
```

Then, from this directory:

```bash
npm install
npm run dev
```

Open [http://localhost:4028](http://localhost:4028). The browser client uses `http://localhost:8080` as its development API by default.

To point the frontend at another API:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 npm run dev
```

## Useful scripts

```bash
npm run dev         # Start the development server on port 4028
npm run type-check  # Check TypeScript without emitting files
npm run build       # Build the static export used by the Docker image
npm run serve       # Serve a previously built Next.js production app
npm run format      # Format source files with Prettier
```

The production Docker build exports this application and copies the generated static files into the Spring Boot JAR, so the complete stack is served from port 8080.
