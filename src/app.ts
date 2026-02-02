import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { z, ZodError } from "zod";
import { appRoutes } from "./http/routes.js";

export const app: Express = express();

app.use(express.json());

appRoutes();

app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation error.",
      issues: z.treeifyError(error)
    });
  }

  console.error(error);

  return response.status(500).json({ message: "Internal server error." });
});
