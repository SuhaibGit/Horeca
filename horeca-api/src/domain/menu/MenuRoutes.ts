import { Router } from "express";
import MenuController from "./MenuController";
import { validateSchema } from "../../Utility/middleware";
import { menuItemCreateSchema, menuItemUpdateSchema } from "./MenuMiddleware";

const menuRouter = Router();
const controller = new MenuController();

menuRouter.get("/", controller.listItems);
menuRouter.get("/:id", controller.getItem);
menuRouter.post("/", validateSchema(menuItemCreateSchema), controller.createItem);
menuRouter.patch("/:id", validateSchema(menuItemUpdateSchema), controller.updateItem);
menuRouter.delete("/:id", controller.deleteItem);

export default menuRouter;
