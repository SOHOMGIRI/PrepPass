const errorHandler = async (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Something went wrong";
  const operation = err.operation ? ` during: ${err.operation}` : "";

  // Log only non-sensitive operational message, never the raw error object
  console.error(`Error ${statusCode}: ${message}${operation}`);

  res.status(statusCode).json({ message: "Something went wrong" });
};

// Check if MongoDB is connected before processing requests
const checkDbConnection = async (req, res, next) => {
  const mongoose = req.app.locals.mongoose || (await import("mongoose")).default;
  
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: "Database temporarily unavailable. Please try again later." 
    });
  }
  
  next();
};

export { errorHandler as default, checkDbConnection };
