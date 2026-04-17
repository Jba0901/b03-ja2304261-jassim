import Deck from "./deck.js";
import renderTags from "./utils/tags.js";
import { faker } from "https://esm.sh/@faker-js/faker";

let decks = [];

function tags() {
  return decks
    .reduce((acc, deck) => acc.concat(deck.tags), [])
    .filter((tag, i, arr) => arr.indexOf(tag) === i)
    .sort();
}

export async function load() {
  try {
    const stored = localStorage.getItem("collection");
    if (stored) {
      decks = JSON.parse(stored).map((d) => Deck.fromJSON(d));
    } else {
      const response = await fetch("data/collection.json");
      const data = await response.json();
      decks = data.map((d) => Deck.fromJSON(d));
      save();
    }
  } catch (e) {
    decks = [];
  }
}

export function save() {
  localStorage.setItem("collection", JSON.stringify(decks));
}

export function render(element) {
  const collection = document.createElement("main");
  collection.className = "collection";

  const header = document.createElement("div");
  header.className = "header";

  // Filter form
  const filterForm = document.createElement("form");
  filterForm.className = "filter";

  const filterLabel = document.createElement("label");
  filterLabel.htmlFor = "filter-keyword";
  const filterIcon = document.createElement("span");
  filterIcon.dataset.lucide = "filter";
  filterIcon.textContent = "Filter";
  filterLabel.appendChild(filterIcon);
  filterForm.appendChild(filterLabel);

  const filterTagsUl = document.createElement("ul");
  filterTagsUl.className = "tags";
  filterForm.appendChild(filterTagsUl);

  header.appendChild(filterForm);

  // Add deck form
  const addForm = document.createElement("form");
  addForm.className = "new";
  const addBtn = document.createElement("button");
  addBtn.title = "add";
  const addIcon = document.createElement("span");
  addIcon.dataset.lucide = "gallery-thumbnails";
  addIcon.textContent = "Add";
  addBtn.appendChild(addIcon);
  addForm.appendChild(addBtn);
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const deck = new Deck({ title: faker.lorem.words({ min: 1, max: 3 }) });
    decks.push(deck);
    const el = deck.render(collection, callback);
    deckElements.set(deck.id, el);
    updateFilterTags();
    save();
  });

  header.appendChild(addForm);
  collection.appendChild(header);

  // Deck tracking
  const deckElements = new Map();

  const callback = (event, id) => {
    if (event === "remove") {
      const idx = decks.findIndex((d) => d.id === id);
      if (idx !== -1) {
        decks.splice(idx, 1);
        const el = deckElements.get(id);
        if (el) el.remove();
        deckElements.delete(id);
      }
    }
    updateFilterTags();
    save();
  };

  // Render all decks
  decks.forEach((deck) => {
    const el = deck.render(collection, callback);
    deckElements.set(deck.id, el);
  });

  element.appendChild(collection);
  lucide.createIcons();
  buildFilterTags();

  // --- Filtering ---

  function buildFilterTags() {
    filterTagsUl.innerHTML = "";

    const hashLi = document.createElement("li");
    hashLi.className = "tag selected";
    hashLi.dataset.tag = "";
    hashLi.textContent = "#";
    addFilterHandler(hashLi);
    filterTagsUl.appendChild(hashLi);

    tags().forEach((tag) => {
      const li = document.createElement("li");
      li.className = "tag selected";
      li.dataset.tag = tag;
      li.textContent = `#${tag}`;
      addFilterHandler(li);
      filterTagsUl.appendChild(li);
    });
  }

  function updateFilterTags() {
    const currentSelected = new Set(
      [...filterTagsUl.querySelectorAll(".tag.selected")].map(
        (t) => t.dataset.tag,
      ),
    );
    const currentAll = new Set(
      [...filterTagsUl.querySelectorAll(".tag")].map((t) => t.dataset.tag),
    );

    filterTagsUl.innerHTML = "";

    const hashLi = document.createElement("li");
    hashLi.className = `tag${currentSelected.has("") ? " selected" : ""}`;
    hashLi.dataset.tag = "";
    hashLi.textContent = "#";
    addFilterHandler(hashLi);
    filterTagsUl.appendChild(hashLi);

    tags().forEach((tag) => {
      const li = document.createElement("li");
      const isSelected = currentAll.has(tag)
        ? currentSelected.has(tag)
        : true;
      li.className = `tag${isSelected ? " selected" : ""}`;
      li.dataset.tag = tag;
      li.textContent = `#${tag}`;
      addFilterHandler(li);
      filterTagsUl.appendChild(li);
    });

    applyFilters();
  }

  function addFilterHandler(li) {
    li.addEventListener("click", (e) => {
      if (e.altKey) {
        const allTags = [...filterTagsUl.querySelectorAll(".tag")];
        const isOnlySelected =
          li.classList.contains("selected") &&
          allTags.filter((t) => t.classList.contains("selected")).length === 1;

        if (isOnlySelected) {
          allTags.forEach((t) => t.classList.add("selected"));
        } else {
          allTags.forEach((t) => t.classList.remove("selected"));
          li.classList.add("selected");
        }
      } else {
        li.classList.toggle("selected");
      }
      applyFilters();
    });
  }

  function applyFilters() {
    const selectedTags = new Set(
      [...filterTagsUl.querySelectorAll(".tag.selected")].map(
        (t) => t.dataset.tag,
      ),
    );

    document.querySelectorAll(".card").forEach((cardEl) => {
      const cardTags = [...cardEl.querySelectorAll(".meta .tag")].map(
        (t) => t.dataset.tag,
      );

      let matches = false;
      if (selectedTags.has("") && cardTags.length === 0) matches = true;
      if (cardTags.some((t) => selectedTags.has(t))) matches = true;

      cardEl.classList.toggle("filtered", !matches);
    });
  }
}
