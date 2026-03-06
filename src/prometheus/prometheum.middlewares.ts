import { Request, Response, NextFunction } from "express";
import { PrometheumService } from "./prometheum.service"

export function PrometheumMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.path.includes('metrics')) {
        next()
        return
    }

    res.on('finish', () => {
        PrometheumService.incStatusCodeMetric(res.statusCode)
    })
    next()
  }