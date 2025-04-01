import {
  InsertTaskSchema,
  SelectTaskSchema,
  UpdateTaskSchema,
} from "@/db/schema.ts";
import { createRoute } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCode from "@/http/status-codes.ts";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";
import { z } from "zod";

const HeaderSchema = z.object({
  authorization: z.string().openapi({
    example: "Bearer <token>",
  }),
});

export const create = createRoute({
  tags: ["Tasks"],
  summary: "Create a task by an authenticated user",
  method: "post",
  path: "/tasks",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    headers: HeaderSchema,
    body: jsonContentRequired(InsertTaskSchema, "Task data"),
  },
  responses: {
    [HttpStatusCode.CREATED]: jsonContent(
      SelectTaskSchema,
      "The created task",
    ),
    [HttpStatusCode.UNAUTHORIZED]: jsonContent(
      z.object({ message: z.string() }),
      "User not logged in",
    ),
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(InsertTaskSchema),
      "Invalid task request data",
    ),
    [HttpStatusCode.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorSchema(z.object({ message: z.string() })),
      "Internal server error",
    ),
  },
});

export const list = createRoute({
  tags: ["Tasks"],
  method: "get",
  path: "/tasks",
  summary: "Get all tasks for the authenticated user",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    headers: HeaderSchema,
  },
  responses: {
    [HttpStatusCode.OK]: jsonContent(
      z.array(SelectTaskSchema),
      "A list of tasks",
    ),
    [HttpStatusCode.UNAUTHORIZED]: jsonContent(
      z.object({ message: z.string() }),
      "User not logged in",
    ),
    [HttpStatusCode.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorSchema(z.object({ message: z.string() })),
      "Internal server error",
    ),
  },
});

export const one = createRoute({
  tags: ["Tasks"],
  method: "get",
  path: "/tasks/{id}",
  summary: "Get a task by its ID for the authenticated user",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    headers: HeaderSchema,
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCode.OK]: jsonContent(
      SelectTaskSchema,
      "The specified task",
    ),
    [HttpStatusCode.UNAUTHORIZED]: jsonContent(
      z.object({ message: z.string() }),
      "User not logged in",
    ),
    [HttpStatusCode.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      "Task not found",
    ),
    [HttpStatusCode.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorSchema(z.object({ message: z.string() })),
      "Internal server error",
    ),
  },
});

export const update = createRoute({
  tags: ["Tasks"],
  method: "patch",
  path: "/tasks/{id}",
  summary: "Update a task by its ID for the authenticated user",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    headers: HeaderSchema,
    params: IdParamsSchema,
    body: jsonContentRequired(UpdateTaskSchema, "Update task data"),
  },
  responses: {
    [HttpStatusCode.CREATED]: jsonContent(
      SelectTaskSchema,
      "The specified task",
    ),
    [HttpStatusCode.UNAUTHORIZED]: jsonContent(
      z.object({ message: z.string() }),
      "User not logged in",
    ),
    [HttpStatusCode.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      "Task not found",
    ),
    [HttpStatusCode.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorSchema(z.object({ message: z.string() })),
      "Internal server error",
    ),
  },
});
export const remove = createRoute({
  tags: ["Tasks"],
  method: "delete",
  path: "/tasks/{id}",
  summary: "Delete a task by its ID for the authenticated user",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    headers: HeaderSchema,
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCode.NO_CONTENT]: {
      description: "Task deleted successfully",
    },
    [HttpStatusCode.UNAUTHORIZED]: jsonContent(
      z.object({ message: z.string() }),
      "User not logged in",
    ),
    [HttpStatusCode.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      "Task not found",
    ),
    [HttpStatusCode.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorSchema(z.object({ message: z.string() })),
      "Internal server error",
    ),
  },
});
export type CreateRoute = typeof create;
export type ListRoute = typeof list;
export type OneRoute = typeof one;
export type UpdateRoute = typeof update;
export type DeleteRoute = typeof remove;