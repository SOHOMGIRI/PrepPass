import dns from "node:dns";
const originalLookup = dns.lookup;
dns.lookup = (hostname, options, callback) => {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  options = { ...options, family: 4 };
  return originalLookup(hostname, options, callback);
};

if (dns.promises && dns.promises.lookup) {
  const originalPromisesLookup = dns.promises.lookup;
  dns.promises.lookup = (hostname, options) => {
    if (typeof options === "number") {
      options = { family: options };
    }
    options = { ...options, family: 4 };
    return originalPromisesLookup(hostname, options);
  };
}

import { setGlobalDispatcher, Agent } from "undici";
setGlobalDispatcher(new Agent({ connect: { family: 4 } }));

import { setDefaultResultOrder } from "node:dns";
setDefaultResultOrder("ipv4first");

import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import resumeAnalysisRoutes from "./routes/resumeAnalysisRoutes.js";
import gdRoutes from "./routes/gdRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import resumeBuilderRoutes from "./routes/resumeBuilderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import revisionRoutes from "./routes/revisionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import { sanitize } from "./middleware/sanitize.js";
import errorHandler from "./middleware/errorHandler.js";

const STRICT_REQUIRED_ENV = [
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

for (const envVar of STRICT_REQUIRED_ENV) {
  if (!process.env[envVar]?.trim()) {
    console.warn(`[CONFIG WARNING] Missing environment variable: ${envVar}. Ensure this is configured for production.`);
  }
}

if (!process.env.EMAIL_USER?.trim() || !process.env.EMAIL_APP_PASSWORD?.trim()) {
  console.warn(
    "[PRÆPPASS CONFIG] EMAIL_USER or EMAIL_APP_PASSWORD not set. Operating in developer Mock Email Mode: verification OTPs will be emitted directly to stdout."
  );
}

const rawClientUrl = (process.env.CLIENT_URL || "http://localhost:5173").trim();
if (!rawClientUrl.startsWith("http")) {
  console.warn(
    `[CONFIG] CLIENT_URL is set to "${rawClientUrl}" but does not start with "http". ` +
      `CORS will not match any origin. Fix CLIENT_URL in your environment variables.`
  );
}

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", "*"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

const CLIENT_URL = rawClientUrl.replace(/\/$/, "");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost dev, configured CLIENT_URL, or direct server calls (no origin)
      if (!origin || origin === CLIENT_URL || origin.includes("localhost") || origin.includes("127.0.0.1") || origin.includes("vercel.app")) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for preview deployments
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(sanitize);
app.use(globalLimiter);
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "PræpPass Intelligence Engine",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/resume/analyze", resumeAnalysisRoutes);
app.use("/api/gd", gdRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/resume-builder", resumeBuilderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/test", testRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/revision", revisionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

try {
  await connectDB();
} catch (dbErr) {
  console.error("[PRÆPPASS DB] Failed initial connection to MongoDB:", dbErr.message);
}

app.listen(PORT, () => {
  console.log(`PræpPass Assessment Server active on port ${PORT}`);
});
