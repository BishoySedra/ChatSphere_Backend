/**
 * Handle 404 - API endpoint not found
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleAPINotFound = (req, res) => {
  res.status(404).send({
    body: null,
    message: "API endpoint not found",
    status: 404
  });
};

export default handleAPINotFound;