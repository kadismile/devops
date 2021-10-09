import bodyParser from 'body-parser';
import compression from 'compression';
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import express, { Request, Response, NextFunction } from 'express';
import cors from "cors";
import ApplicationError from './errors/application-error';
// @ts-ignore
import routerConfig from './routes/config'
import logger from './logger';
import accessEnv from "./helpers/accessEnv";

const app = express();
app.use(
  cors({
    origin: (origin: any, cb: (arg0: null, arg1: boolean) => any) => cb(null, true),
    credentials: true,
    preflightContinue: true,
    exposedHeaders: [
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept",
      "X-Password-Expired"
    ],
    optionsSuccessStatus: 200
  })
)

function logResponseTime(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    const message = `${req.method} ${res.statusCode} ${elapsedTimeInMs}ms\t${req.path}`;
    logger.log({
      level: 'debug',
      message,
      consoleLoggerOptions: { label: 'API' }
    });
  });

  next();
}

app.use(logResponseTime);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerOptions: any = {
  swaggerDefinition: {
    info: {
      title: "Next-handle API Docs",
      description: "APi documentation for next handle",
      contact: {
        name: "Kadismile"
      },
      servers: [accessEnv("DOMAIN_URL")]
    }
  },
  apis: ["./src/documentations/*.ts"]
}
const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

//Routes
routerConfig.forEach((rou: any[]) => {
  let route = rou[0]
  let router = rou[1]
  app.use(route, router)
})

app.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  return res.status(err.status || 500).json({
    error: err.message
  });
});

export default app;
