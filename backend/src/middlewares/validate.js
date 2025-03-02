export const validate = (schema) => {
  return (req, res, next) => {
    const dataToValidate = {
      ...req.body,
      ...req.params,
      ...req.query,
    };

    const { error } = schema.validate(dataToValidate, {
      abortEarly: false, // Collect all validation errors
      allowUnknown: true, // Allow unknown keys
      stripUnknown: true, // Remove unknown keys
    });

    if (error) {
      const errorMessage = error.details[0].message;

      return next(new AppError(400, "Validation error", errorMessage));
    }

    next();
  };
};
