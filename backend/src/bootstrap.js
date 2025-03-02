import { AppError } from "./utils/AppError.js";
import { globalErrorHandling } from "./middlewares/GlobalErrorHandling.js";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.routes.js";
import employeeRouter from "./modules/employee/employee.routes.js";
import tableRouter from "./modules/table/table.routes.js";
import reservationRouter from "./modules/reservation/reservation.routes.js";
import menuRouter from "./modules/menu/menu.routes.js";
import orderRouter from "./modules/order/order.routes.js";
import cartRouter from "./modules/cart/cart.routes.js";

export function bootstrap(app) {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/employee", employeeRouter);
  app.use("/api/v1/tables", tableRouter);
  app.use("/api/v1/reservations", reservationRouter);
  app.use("/api/v1/menu", menuRouter);
  app.use("/api/v1/orders", orderRouter);
  app.use("/api/v1/cart",cartRouter);

  app.all("*", (req, res, next) => {
    next(new AppError(404,"Endpoint was not found"));
  });

  app.use(globalErrorHandling);
}
