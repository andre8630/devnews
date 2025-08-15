test("GET to /api/v1/status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  const parsedUpdatedAt = new Date(responseBody.update_at).toISOString();

  expect(response.status).toBe(200);

  expect(responseBody.update_at).toEqual(parsedUpdatedAt);

  expect(responseBody.dependencies.database.version).toEqual("17.5");
  expect(responseBody.dependencies.database.max_connections).toBe(100);
  expect(responseBody.dependencies.database.current_connections).toBe(1);
});
