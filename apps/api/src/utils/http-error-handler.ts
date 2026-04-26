import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { NotFoundError, ValidationError } from "../core/errors.js";

export function httpErrorHandler(
  error: FastifyError | Error,
  _request: FastifyRequest,
  reply: FastifyReply
): void {
  if (error instanceof ZodError || error instanceof ValidationError) {
    reply.code(400).send({
      error: "bad_request",
      message: error.message
    });
    return;
  }

  if (error instanceof NotFoundError) {
    reply.code(404).send({
      error: "not_found",
      message: error.message
    });
    return;
  }

  reply.code(500).send({
    error: "internal_error",
    message: "Error interno del servidor."
  });
}
