import { NehoID } from "../../index";

const existingIds = new Set();

const id = await NehoID.safe({
  name: "test-collision-strategy",
  backoffType: "linear",
  checkFunction: async (id) => !existingIds.has(id),
  maxAttempts: 3,
});

console.log("id: ", id);
