import {Request} from "express";
import {BaseQueryDTO} from "../../core/repository/DTO/QueryParamsDTO";

export function getQueryParams<T extends object>(
    req: Request,
    extraFields: Record<keyof T, "string" | "number" | "boolean"> = {} as any
): BaseQueryDTO & T {
    const sortBy = req.query.sortBy?.toString() || 'createdAt';
    const sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc';
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const extras = {} as T;

    for (const key in extraFields) {
        if (extraFields[key] === "string") {
            (extras as any)[key] = (req.query[key] as string) || null;
        }
        if (extraFields[key] === "number") {
            (extras as any)[key] = parseInt(req.query[key] as string) || null;
        }
        if (extraFields[key] === "boolean") {
            (extras as any)[key] = req.query[key] === "true";
        }
    }

    return {
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
        ...extras
    };
}
