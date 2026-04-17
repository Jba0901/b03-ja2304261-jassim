import StringList from "../base/cards/string-list.js";
import Card from "../card.js";

StringList.prototype.render = function (element, callback) {
  return Card.prototype.render.call(this, element, callback);
};

export default StringList;
