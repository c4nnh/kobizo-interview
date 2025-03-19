export enum ErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  EMAIL_DUPLICATED = "EMAIL_DUPLICATED",
  NOT_MATCH_PASSWORD_COMPLEXITY_RULES = "NOT_MATCH_PASSWORD_COMPLEXITY_RULES",
  ASSIGNEE_NOT_FOUND = "ASSIGNEE_NOT_FOUND",
  TASK_NOT_FOUND = "TASK_NOT_FOUND",
  PARENT_TASK_CANNOT_BE_THE_SAME_AS_THE_TASK = "PARENT_TASK_CANNOT_BE_THE_SAME_AS_THE_TASK",
}
