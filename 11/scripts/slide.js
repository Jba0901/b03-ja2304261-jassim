import Slide from "./base/slide.js";
import "./cards/foreign-word.js";
import "./cards/playing-card.js";
import "./cards/string-list.js";
import renderTags from "./utils/tags.js";
import { faker } from "https://esm.sh/@faker-js/faker";

const pips = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];

function randomTags() {
  const count = faker.number.int({ min: 0, max: 3 });
  return Array.from({ length: count }, () => faker.lorem.word());
}

function randomCardOfType(type) {
  if (type === "foreign-word") {
    return {
      type: "foreign-word",
      tags: randomTags(),
      data: {
        word: faker.lorem.word(),
        pronunciation: faker.lorem.word(),
        translation: faker.lorem.words({ min: 1, max: 3 }),
      },
    };
  } else if (type === "playing-card") {
    return {
      type: "playing-card",
      tags: randomTags(),
      data: {
        pip: faker.helpers.arrayElement(pips),
        suit: faker.helpers.arrayElement(suits),
      },
    };
  } else {
    const count = faker.number.int({ min: 2, max: 6 });
    return {
      type: "string-list",
      tags: randomTags(),
      data: {
        items: Array.from({ length: count }, () => faker.lorem.word()),
      },
    };
  }
}

function randomCard() {
  const types = ["foreign-word", "playing-card", "string-list"];
  return randomCardOfType(faker.helpers.arrayElement(types));
}

function updateTags(container, newTags) {
  const meta = container.querySelector(":scope > .header > .meta");
  const oldTags = meta.querySelector(".tags");
  if (oldTags) oldTags.remove();
  if (newTags.length > 0) {
    meta.appendChild(renderTags(newTags));
  }
}

Slide.prototype.render = function (element, callback) {
  const container = document.createElement("section");
  container.className = "slide";

  const header = document.createElement("div");
  header.className = "header";

  const meta = document.createElement("div");
  meta.className = "meta";

  const title = document.createElement("h3");
  title.className = "title";
  title.textContent = this.title;
  title.addEventListener("click", () => {
    if (this.cards.length === 0) {
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
  addIcon.dataset.lucide = "columns-3";
  addIcon.textContent = "Add";
  addBtn.appendChild(addIcon);
  form.appendChild(addBtn);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cardData = randomCard();
    const card = this.add(cardData);
    card.render(cardsContainer, innerCallback);
    updateTags(container, this.tags);
    if (callback) callback("update", this.id);
  });

  header.appendChild(form);
  container.appendChild(header);

  const cardsContainer = document.createElement("div");
  cardsContainer.className = "cards";

  const innerCallback = (event, id) => {
    if (event === "remove") {
      const card = this.remove(id);
      if (card) {
        document.getElementById(id)?.remove();
        updateTags(container, this.tags);
        if (callback) callback("update", this.id);
      }
    } else if (event === "shuffle") {
      const card = this.get(id);
      if (card) {
        const type = card.toJSON().type;
        const newData = randomCardOfType(type);
        card.tags.length = 0;
        newData.tags.forEach((t) => card.tags.push(t));
        Object.assign(card.data, newData.data);
        const oldEl = document.getElementById(id);
        const parent = oldEl.parentElement;
        const temp = document.createElement("div");
        const newEl = card.render(temp, innerCallback);
        parent.replaceChild(newEl, oldEl);
        lucide.createIcons();
        updateTags(container, this.tags);
        if (callback) callback("update", this.id);
      }
    } else if (event === "update") {
      updateTags(container, this.tags);
      if (callback) callback("update", this.id);
    }
  };

  this.cards.forEach((card) => {
    card.render(cardsContainer, innerCallback);
  });

  container.appendChild(cardsContainer);

  element.appendChild(container);
  lucide.createIcons();
  return container;
};

export default Slide;
