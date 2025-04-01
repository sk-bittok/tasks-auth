import db from "./index.ts";
import * as userRepository from "@/db/users.ts";
import { tasksTable } from "./schema.ts";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";

export interface UpdateTaskParams {
  title?: string;
  description?: string | null;
  done?: boolean;
}

export async function createTask(
  claimsKey: string,
  title: string,
  description: string | null,
) {
  const user = await userRepository.findByClaimsKey(claimsKey);
  const [task] = await db.insert(tasksTable).values({
    userId: user.id,
    title,
    description,
  })
    .returning();

  if (!task) {
    throw new HTTPException(500, {
      message: "Something went wrong on our end.",
    });
  }

  return task;
}

export async function findAll(claimsKey: string) {
  const user = await userRepository.findByClaimsKey(claimsKey);
  const tasks = await db.select().from(tasksTable).where(
    eq(tasksTable.userId, user.id),
  );

  return tasks;
}

export async function findOne(claimsKey: string, id: number) {
  const user = await userRepository.findByClaimsKey(claimsKey);
  const [task] = await db.select().from(tasksTable)
    .where(eq(tasksTable.id, id) && eq(tasksTable.userId, user.id));

  if (!task) {
    throw new HTTPException(404, {
      message: "Task not found",
      cause: `No task with ID ${id} by user ${user.id}`,
    });
  }

  return task;
}

export async function deleteById(claimsKey: string, id: number) {
  const user = await userRepository.findByClaimsKey(claimsKey);

  const [deletedTask] = await db.delete(tasksTable).where(
    eq(tasksTable.id, id) && eq(tasksTable.userId, user.id),
  ).returning();

  if (!deletedTask) {
    const [existingTask] = await db.select().from(tasksTable).where(
      eq(tasksTable.id, id),
    );

    if (existingTask) {
      throw new HTTPException(401, {
        message: "Permission denied",
        cause:
          `UserID ${user.id} does not have permission to delete task ${id}`,
      });
    }

    throw new HTTPException(404, {
      message: "Task not found",
      cause: `No task with ID ${id} by user ${user.id}`,
    });
  }

  return deletedTask;
}

export async function updateTask(
  id: number,
  claimsKey: string,
  params: UpdateTaskParams,
) {
  const user = await userRepository.findByClaimsKey(claimsKey);
  const [taskToUpdate] = await db.select().from(tasksTable).where(
    eq(tasksTable.id, id),
  );

  if (!taskToUpdate) {
    throw new HTTPException(404, {
      message: "Task not found",
      cause: `No task with ID ${id}}`,
    });
  }

  if (taskToUpdate.userId !== user.id) {
    throw new HTTPException(401, {
      message: "Permission denied",
      cause: `UserID ${user.id} does not have permission to update task ${id}`,
    });
  }

  const [updatedTask] = await db.update(tasksTable).set({
    title: params.title !== undefined ? params.title : taskToUpdate.title,
    description: params.description !== undefined
      ? params.description
      : taskToUpdate.description,
    done: params.done !== undefined ? params.done : taskToUpdate.done,
  }).returning();

  if (!updateTask) {
    throw new HTTPException(500, {
      message: "Something went wrong on our end",
      cause: `Failed to update task ${id} by user ${user.id}`,
    });
  }

  return updatedTask;
}
