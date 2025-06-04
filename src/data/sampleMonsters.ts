// src/data/sampleMonsters.ts
import { Monster } from "../types";
import { v4 as uuidv4 } from "uuid";

export const sampleMonsters: Monster[] = [
  {
    id: uuidv4(),
    name: "Dragão Vermelho",
    attack: 50,
    defense: 30,
    speed: 40,
    hp: 125,
    image_url: "/red_dragon_card.png",
  },
  {
    id: uuidv4(),
    name: "Golem de Pedra",
    attack: 40,
    defense: 50,
    speed: 25,
    hp: 150,
    image_url: "/stone_golen_card.png",
  },
  {
    id: uuidv4(),
    name: "Lobo Sombrio",
    attack: 48,
    defense: 22,
    speed: 65,
    hp: 100,
    image_url: "/shadow_wolf_card.png",
  },
  {
    id: uuidv4(),
    name: "Urso de Guerra",
    attack: 45,
    defense: 38,
    speed: 30,
    hp: 135,
    image_url: "/war_bear_card.png",
  },
  {
    id: uuidv4(),
    name: "Medusa",
    attack: 47,
    defense: 28,
    speed: 55,
    hp: 110,
    image_url: "/medusa_card.png",
  },
];

export const getInitialMonsters = (): Monster[] => {
  return sampleMonsters.map((monster) => ({
    ...monster,
    id: uuidv4(),
  }));
};
