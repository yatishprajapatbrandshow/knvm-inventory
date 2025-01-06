// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
