import PlayingCard from "../base/cards/playing-card.js";
import Card from "../card.js";

PlayingCard.prototype.render = function (element, callback) {
  return Card.prototype.render.call(this, element, callback);
};

export default PlayingCard;
