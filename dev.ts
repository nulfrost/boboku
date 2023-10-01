import { watch } from "node:fs";
import { reloadCommands } from "./deploy-commands";

const watcher = watch(`${import.meta.dir}/commands`, (event, filename) => {
  console.log(`Detected ${event} in ${filename}`);
  reloadCommands();
});

process.on("SIGINT", () => {
  console.log("Closing watcher...");
  watcher.close();

  process.exit(0);
});
