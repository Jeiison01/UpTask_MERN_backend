
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const { details } = error;
    const message = details.map((detail) => detail.message).join(', ');
    return res.status(400).json({ error: message });
  }
  next(); // If validation passes, continue to the route handler
};

export default validateRequest