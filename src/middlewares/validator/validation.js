function validate(schema) {
  return async function (req, res, next) {
    try {
      const validatedResult = await schema.validateAsync(req.body, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      res.status(400).json({
        body: error.details.map((detail) => ({
          message: detail.message,
          field: detail.path.join("."),
        })),
        status: 400,
        message: "Validation Error",
      });
    }
  };
}

export default validate;
