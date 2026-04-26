import { describe, test, expect } from "bun:test";
import Slide from "./scripts/slide.js";
import ForeignWord from "./scripts/cards/foreign-word.js";
import PlayingCard from "./scripts/cards/playing-card.js";
import StringList from "./scripts/cards/string-list.js";

describe("class Slide", () => {
  describe("add(card)", () => {
    test("adds the card to #cards", () => {
      const slide = new Slide();
      const card = slide.add({
        type: "playing-card",
        data: { pip: "A", suit: "Spades" },
      });
      expect(slide.cards.find((c) => c.id === card.id)).toBeDefined();
    });
  });

  describe("remove(id)", () => {
    test("removes the card with id from #cards", () => {
      const slide = new Slide();
      const card = slide.add({
        type: "playing-card",
        data: { pip: "A", suit: "Spades" },
      });
      slide.remove(card.id);
      expect(slide.cards.find((c) => c.id === card.id)).toBeUndefined();
    });
  });

  describe("get(id)", () => {
    test("returns a reference to a card in #cards", () => {
      const slide = new Slide({
        cards: [
          { type: "playing-card", data: { pip: "A", suit: "Spades" } },
        ],
      });
      const card = slide.cards[0];
      const ref = slide.get(card.id);
      ref.data.pip = "K";
      expect(slide.get(card.id).data.pip).toBe("K");
    });
  });

  describe("cards()", () => {
    test("returns a copy of #cards and not a reference to it", () => {
      const slide = new Slide({
        cards: [
          { type: "playing-card", data: { pip: "A", suit: "Spades" } },
        ],
      });
      const cards = slide.cards;
      cards.push(
        new PlayingCard({ data: { pip: "K", suit: "Hearts" } }),
      );
      expect(slide.cards.length).toBe(1);
    });
  });

  describe("tags()", () => {
    test("returns an array of unique elements", () => {
      const slide = new Slide({
        cards: [
          {
            type: "playing-card",
            tags: ["tag1", "tag2"],
            data: { pip: "A", suit: "Spades" },
          },
          {
            type: "playing-card",
            tags: ["tag2", "tag3"],
            data: { pip: "K", suit: "Hearts" },
          },
        ],
      });
      const slideTags = slide.tags;
      const unique = slideTags.filter(
        (t, i, arr) => arr.indexOf(t) === i,
      );
      expect(slideTags.length).toBe(unique.length);
    });
  });

  describe("#toCard(card)", () => {
    test("uses the correct type when creating a card", () => {
      const slide = new Slide();
      const fw = slide.add({
        type: "foreign-word",
        data: {
          word: "hello",
          pronunciation: "hello",
          translation: "hello",
        },
      });
      const pc = slide.add({
        type: "playing-card",
        data: { pip: "A", suit: "Spades" },
      });
      const sl = slide.add({
        type: "string-list",
        data: { items: ["a", "b"] },
      });
      expect(fw).toBeInstanceOf(ForeignWord);
      expect(pc).toBeInstanceOf(PlayingCard);
      expect(sl).toBeInstanceOf(StringList);
    });
  });
});
