import { load, render } from "./collection.js";

document.addEventListener("DOMContentLoaded", async function () {
  await load();
  render(document.body);
});
