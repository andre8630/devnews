function status(request, response) {
  return response.status(200).json({ message: "hello" });
}

export default status;
