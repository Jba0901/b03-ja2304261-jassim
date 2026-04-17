import Card from "./base/card.js";
import renderTags from "./utils/tags.js";

const suitIcons = {
  Spades: "spade",
  Hearts: "heart",
  Diamonds: "diamond",
  Clubs: "club",
};

Card.prototype.render = function (element, callback) {
  const json = this.toJSON();
  const type = json.type;

  const container = document.createElement("div");
  container.className = `card ${type}`;
  container.id = this.id;

  const content = document.createElement("div");
  content.className = "content";

  if (type === "foreign-word") {
    const word = document.createElement("div");
    word.className = "word";
    word.textContent = this.data.word;

    const pronunciation = document.createElement("div");
    pronunciation.className = "pronunciation";
    pronunciation.textContent = this.data.pronunciation;

    const translation = document.createElement("div");
    translation.className = "translation";
    translation.textContent = this.data.translation;

    content.append(word, pronunciation, translation);
  } else if (type === "playing-card") {
    const pip = document.createElement("div");
    pip.className = "pip";
    pip.textContent = this.data.pip;

    const suit = document.createElement("div");
    suit.className = "suit";
    const icon = document.createElement("span");
    icon.dataset.lucide = suitIcons[this.data.suit];
    icon.textContent = this.data.suit;
    suit.appendChild(icon);

    content.append(pip, suit);
  } else if (type === "string-list") {
    const ul = document.createElement("ul");
    this.data.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
    content.appendChild(ul);
  }

  container.appendChild(content);

  const meta = document.createElement("div");
  meta.className = "meta";
  if (this.tags.length > 0) {
    meta.appendChild(renderTags(this.tags));
  }
  container.appendChild(meta);

  const actions = document.createElement("div");
  actions.className = "actions";

  const removeBtn = document.createElement("button");
  removeBtn.title = "remove";
  removeBtn.className = "remove";
  const removeIcon = document.createElement("span");
  removeIcon.dataset.lucide = "x";
  removeIcon.textContent = "Remove";
  removeBtn.appendChild(removeIcon);
  removeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (callback) callback("remove", this.id);
  });
  actions.appendChild(removeBtn);
  container.appendChild(actions);

  container.addEventListener("click", () => {
    if (callback) callback("shuffle", this.id);
  });

  element.appendChild(container);
  lucide.createIcons();
  return container;
};

export default Card;
