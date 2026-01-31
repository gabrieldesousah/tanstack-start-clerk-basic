import cron from "node-cron";

import { discoveryWordsFromAllUsers } from "~/infra/automations/discoveryWordsFromAllUsers";
import { findTasksFromAllUsers } from "~/infra/automations/findTasksFromAllUsers";

// Run every 6 hours (at minute 0)
cron.schedule("0 */6 * * *", async () => {
  console.log("Running: Find tasks from all users");
  try {
    await findTasksFromAllUsers();
  } catch (error) {
    console.error("Error in findTasksFromAllUsers cron:", error);
  }
});

// Run every 4 hours (at minute 0)
cron.schedule("0 */4 * * *", async () => {
  console.log("Running: Discovery words for all users");
  try {
    await discoveryWordsFromAllUsers();
  } catch (error) {
    console.error("Error in discoveryWordsFromAllUsers cron:", error);
  }
});

console.log("Cron jobs scheduled");
