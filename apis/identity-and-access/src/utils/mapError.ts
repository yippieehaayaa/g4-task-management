import {
  AccountLockedError,
  EmailExistsError,
  GroupNotFoundError,
  IdentityNotFoundError,
  InvalidCredentialsError,
  InvalidCurrentPasswordError,
  InvalidOtpError,
  MaxOtpAttemptsExceededError,
  OtpExpiredError,
  OtpNotFoundError,
  PasswordReuseError,
  PolicyNotFoundError,
  RoleNotFoundError,
  SessionNotFoundError,
  UsernameExistsError,
} from "@g4/db-iam";
import {
  type AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  TooManyRequestsError,
  UnauthorizedError,
} from "@g4/error-handler";

export function mapDbIamError(err: unknown): AppError | null {
  if (err instanceof IdentityNotFoundError)
    return new NotFoundError(err.message);
  if (err instanceof InvalidCredentialsError)
    return new ForbiddenError(err.message);
  if (err instanceof AccountLockedError)
    return new TooManyRequestsError(err.message);
  if (err instanceof InvalidCurrentPasswordError)
    return new UnauthorizedError(err.message);
  if (err instanceof PasswordReuseError)
    return new BadRequestError(err.message, { code: "PASSWORD_REUSED" });
  if (err instanceof EmailExistsError) return new ConflictError(err.message);
  if (err instanceof UsernameExistsError) return new ConflictError(err.message);
  if (err instanceof RoleNotFoundError) return new NotFoundError(err.message);
  if (err instanceof GroupNotFoundError) return new NotFoundError(err.message);
  if (err instanceof PolicyNotFoundError) return new NotFoundError(err.message);
  if (err instanceof SessionNotFoundError)
    return new NotFoundError(err.message);
  if (
    err instanceof OtpNotFoundError ||
    err instanceof OtpExpiredError ||
    err instanceof MaxOtpAttemptsExceededError ||
    err instanceof InvalidOtpError
  )
    return new BadRequestError(err.message);
  return null;
}
