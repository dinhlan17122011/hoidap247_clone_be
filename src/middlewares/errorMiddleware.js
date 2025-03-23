const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
  };
  
  module.exports = errorMiddleware;
  