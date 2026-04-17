export default function renderTags(tags) {
  const ul = document.createElement("ul");
  ul.className = "tags";
  [...tags].sort().forEach((tag) => {
    const li = document.createElement("li");
    li.className = "tag";
    li.dataset.tag = tag;
    li.textContent = `#${tag}`;
    ul.appendChild(li);
  });
  return ul;
}
