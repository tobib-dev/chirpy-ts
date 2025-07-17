import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handlerValidateChirps } from "./api/chirps.js";
import {
  middlewareLogResponses,
  middlewareMetricsInc,
  middlewareErrorHandler,
} from "./api/middleware.js";
import { handlerMetrics } from "./admin/metrics.js";
import { handlerReset } from "./admin/reset.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.post("/api/validate_chirp", (req, res, next) => {
  Promise.resolve(handlerValidateChirps(req, res)).catch(next);
});
app.use(middlewareErrorHandler);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
