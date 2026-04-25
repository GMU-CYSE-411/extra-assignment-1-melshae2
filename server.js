const { createApp } = require("./server/app");

const port = Number(process.env.PORT || 3000);

async function start() {
  const app = await createApp();

  app.listen(port, () => {
    console.log(`CYSE 411 training app listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
