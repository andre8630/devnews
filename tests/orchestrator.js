import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      maxTimeout: 1000,
      retries: 100,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (!response.ok) {
        throw new console.error();
      }
    }
  }
}

const orchastrator = {
  waitForAllServices,
};
export default orchastrator;
