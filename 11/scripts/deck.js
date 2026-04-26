import Deck from "./base/deck.js";
import "./slide.js";
import renderTags from "./utils/tags.js";
import { faker } from "https://esm.sh/@faker-js/faker";

function updateTags(container, newTags) {
  const meta = container.querySelector(":scope > .header > .meta");
  const oldTags = meta.querySelector(".tags");
  if (oldTags) oldTags.remove();
  if (newTags.length > 0) {
    meta.appendChild(renderTags(newTags));
  }
}

Deck.prototype.render = function (element, callback) {
  const container = document.createElement("section");
  container.className = "deck";

  const header = document.createElement("div");
  header.className = "header";

  const meta = document.createElement("div");
  meta.className = "meta";

  const title = document.createElement("h2");
  title.className = "title";
  title.textContent = this.title;
  title.addEventListener("click", () => {
    if (this.slides.length === 0) {
      if (callback) callback("remove", this.id);
    }
  });
  meta.appendChild(title);

  if (this.tags.length > 0) {
    meta.appendChild(renderTags(this.tags));
  }

  header.appendChild(meta);

  const form = document.createElement("form");
  form.className = "new";
  const addBtn = document.createElement("button");
  addBtn.title = "add";
  addBtn.type = "submit";
  const addIcon = document.createElement("span");
  addIcon.dataset.lucide = "rows-3";
  addIcon.textContent = "Add";
  addBtn.appendChild(addIcon);
  form.appendChild(addBtn);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const slideData = { title: faker.lorem.words({ min: 1, max: 3 }) };
    const slide = this.add(slideData);
    const el = slide.render(slidesContainer, innerCallback);
    slideElements.set(slide.id, el);
    updateTags(container, this.tags);
    if (callback) callback("update", this.id);
  });

  header.appendChild(form);
  container.appendChild(header);

  const slidesContainer = document.createElement("div");
  slidesContainer.className = "slides";

  const slideElements = new Map();

  const innerCallback = (event, id) => {
    if (event === "remove") {
      const slide = this.remove(id);
      if (slide) {
        const el = slideElements.get(id);
        if (el) el.remove();
        slideElements.delete(id);
        updateTags(container, this.tags);
        if (callback) callback("update", this.id);
      }
    } else if (event === "update") {
      updateTags(container, this.tags);
      if (callback) callback("update", this.id);
    }
  };

  this.slides.forEach((slide) => {
    const el = slide.render(slidesContainer, innerCallback);
    slideElements.set(slide.id, el);
  });

  container.appendChild(slidesContainer);

  element.appendChild(container);
  lucide.createIcons();
  return container;
};

export default Deck;
