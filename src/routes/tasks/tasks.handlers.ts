import * as jwt from "hono/jwt";

import type {
    CreateRoute,
    DeleteRoute,
    ListRoute,
    OneRoute,
    UpdateRoute,
} from "./tasks.routes.ts";
import * as tasksRepository from "@/db/tasks.ts";
import type { AppRouteHandler } from "@/lib/config-app.ts";
import env from "@/env.ts";
import type { JWTPayload } from "hono/utils/jwt/types";

const JWT_SECRET = env.JWT_SECRET;

export const create: AppRouteHandler<CreateRoute> = async (c) => {
    const { authorization } = c.req.valid("header");
    let payload: JWTPayload;
    try {
        payload = await jwt.verify(authorization, JWT_SECRET);
    } catch (e) {
        c.var.logger.error("JWT verification failed: ", e);
        return c.json({ message: "Unauthorized" }, 401);
    }
    const { title, description } = c.req.valid("json");
    const newTask = await tasksRepository.createTask(
        payload.sub as string,
        title,
        description,
    );

    return c.json(newTask, 201);
};

export const list: AppRouteHandler<ListRoute> = async (c) => {
    const { authorization } = c.req.valid("header");
    let payload: JWTPayload;
    try {
        payload = await jwt.verify(authorization, JWT_SECRET);
    } catch (e) {
        c.var.logger.error("JWT verification failed: ", e);
        return c.json({ message: "Unauthorized" }, 401);
    }
    const tasks = await tasksRepository.findAll(payload.sub as string);

    return c.json(tasks, 200);
};

export const one: AppRouteHandler<OneRoute> = async (c) => {
    const { id } = c.req.valid("param");
    const { authorization } = c.req.valid("header");

    let payload: JWTPayload;
    try {
        payload = await jwt.verify(authorization, JWT_SECRET);
    } catch (e) {
        c.var.logger.error("JWT verification failed: ", e);
        return c.json({ message: "Unauthorized" }, 401);
    }

    const task = await tasksRepository.findOne(payload.sub as string, id);

    return c.json(task, 200);
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
    const { id } = c.req.valid("param");

    const { authorization } = c.req.valid("header");
    let payload: JWTPayload;
    try {
        payload = await jwt.verify(authorization, JWT_SECRET);
    } catch (e) {
        c.var.logger.error("JWT verification failed: ", e);
        return c.json({ message: "Unauthorized" }, 401);
    }

    const { title, description, done } = c.req.valid("json");

    const task = await tasksRepository.updateTask(id, payload.sub as string, {
        title,
        description,
        done,
    });

    return c.json(task, 201);
};

export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
    const { id } = c.req.valid("param");

    const { authorization } = c.req.valid("header");
    let payload: JWTPayload;
    try {
        payload = await jwt.verify(authorization, JWT_SECRET);
    } catch (e) {
        c.var.logger.error("JWT verification failed: ", e);
        return c.json({ message: "Unauthorized" }, 401);
    }

    const deleted = await tasksRepository.deleteById(payload.sub as string, id);

    c.var.logger.info(
        `Deleted task ${deleted.title} by user ${deleted.userId}`,
    );

    return c.body(null, 204);
};
