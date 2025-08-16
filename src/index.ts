import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
  middlewareLogResponses,
  middlewareMetricsInc,
  middlewareErrorHandler,
} from "./api/middleware.js";
import { handlerMetrics } from "./admin/metrics.js";
import { handlerReset } from "./admin/reset.js";
import { handlerCreateUser } from "./api/users.js";
import {
  handlerCreateChirp,
  handlerGetAllChirps,
  handlerGetChirp,
} from "./api/chirps.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next);
});

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});

app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerCreateUser(req, res)).catch(next);
});

app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerCreateChirp(req, res)).catch(next);
});

app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerGetAllChirps(req, res)).catch(next);
});

app.get("/api/chirps/:chirpID", (req, res, next) => {
  Promise.resolve(handlerGetChirp(req, res)).catch(next);
});

app.use(middlewareErrorHandler);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
