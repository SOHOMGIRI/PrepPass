const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Something went wrong";

  // Log only non-sensitive operational message, never the raw error object
  console.error(`Error ${statusCode}: ${message}`);

  res.status(statusCode).json({ message: "Something went wrong" });
};

export default errorHandler;
