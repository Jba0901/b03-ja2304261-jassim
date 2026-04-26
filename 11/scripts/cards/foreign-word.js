import ForeignWord from "../base/cards/foreign-word.js";
import Card from "../card.js";

ForeignWord.prototype.render = function (element, callback) {
  return Card.prototype.render.call(this, element, callback);
};

export default ForeignWord;
