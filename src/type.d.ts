import "express";
import { RequestContext } from "./common/contexts/request.context";

declare module "express" {
  export interface Request {
    context: RequestContext;
  }
}
