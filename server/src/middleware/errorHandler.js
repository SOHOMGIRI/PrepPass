const errorHandler = async (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "An unexpected error occurred";
  const operation = err.operation ? ` during: ${err.operation}` : "";

  // Log non-sensitive operational message
  console.error(`[SERVER ERROR] ${statusCode}: ${message}${operation}`);

  // Return clean, transparent error message so users and clients know what happened
  res.status(statusCode).json({ message });
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
