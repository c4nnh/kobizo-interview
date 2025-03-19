import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ErrorCode } from "../types/error.type";

export function convertErrorCodeToException(code?: number) {
  switch (code) {
    case 400:
      return new BadRequestException(ErrorCode.BAD_REQUEST);
    case 401:
      return new UnauthorizedException(ErrorCode.UNAUTHORIZED);
    case 403:
      return new ForbiddenException(ErrorCode.FORBIDDEN);
    case 404:
      return new NotFoundException(ErrorCode.NOT_FOUND);
    case 409:
      return new ConflictException(ErrorCode.CONFLICT);
    case 500:
      return new InternalServerErrorException(ErrorCode.INTERNAL_SERVER_ERROR);
    default:
      return new Error(ErrorCode.UNKNOWN_ERROR);
  }
}
