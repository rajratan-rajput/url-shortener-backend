const errorHandler = (err, req, res, next) => {
  const statusCode =
    err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  console.error(`[${req.method} ${req.path}]`, err.message);

  const clientMessage =
    process.env.NODE_ENV === "production" && statusCode >= 500
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
  });
};
export default errorHandler;