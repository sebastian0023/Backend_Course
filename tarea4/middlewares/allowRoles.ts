import type { Request, Response, NextFunction } from "express";

export function allowRoles(rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRoles = [req.query.role].flat().filter((role): role is string => typeof role === "string");

    const hasPermission = userRoles.some((role) => rolesPermitidos.includes(role));

    if (!hasPermission) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  };
}