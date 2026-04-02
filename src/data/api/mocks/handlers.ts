import { http, HttpHandler, HttpResponse } from "msw";

import { ENDPOINTS } from "../index";
import { Json } from "../../../devtools/types";

const successfulGetHandler = (endpoint: string, mockData: Json): HttpHandler =>
  http.get(endpoint, () => HttpResponse.json(mockData, { status: 200 }));

const cardsRequestHandler: HttpHandler = successfulGetHandler(ENDPOINTS.CARDS, {
  asset_bundle: "49",
  attack: "6",
  card_type: "character",
  character: "fg_stewie",
  desc: "What the deuce?! Damn you all! Ha ha, classic. Stewie here. We're gonna have fun together.",
  health: "36",
  id: "10076",
  name: "Stewie",
  picture: "FG_LMStewie",
  power: 54,
  rarity: "4",
  release_time: "1563127200",
  set: "2",
  skill: [
    {
      id: "barrierall",
      x: "1",
    },
    {
      id: "strike",
      x: "2",
    },
    {
      id: "leech",
      x: "4",
    },
  ],
  type: "1",
  upgrade: [
    {
      health: "37",
      level: "2",
      power: 55,
      skill: [
        {
          id: "barrierall",
          x: "1",
        },
        {
          id: "strike",
          x: "3",
        },
        {
          id: "leech",
          x: "4",
        },
      ],
    },
    {
      health: "38",
      level: "3",
      power: 56,
      skill: [
        {
          id: "barrierall",
          x: "1",
        },
        {
          id: "strike",
          x: "3",
        },
        {
          id: "leech",
          x: "5",
        },
      ],
    },
    {
      attack: "7",
      health: "39",
      level: "4",
      power: 60,
    },
    {
      health: "40",
      level: "5",
      power: 61,
      skill: [
        {
          id: "barrierall",
          x: "1",
        },
        {
          id: "strike",
          x: "3",
        },
        {
          id: "leech",
          x: "6",
        },
      ],
    },
    {
      attack: "8",
      health: "41",
      level: "6",
      power: 65,
      skill: [
        {
          id: "barrierall",
          x: "1",
        },
        {
          id: "strike",
          x: "4",
        },
        {
          id: "leech",
          x: "6",
        },
      ],
    },
    {
      health: "42",
      level: "7",
      power: 66,
      skill: [
        {
          id: "barrierall",
          x: "1",
        },
        {
          id: "strike",
          x: "4",
        },
        {
          id: "leech",
          x: "7",
        },
      ],
    },
    {
      health: "43",
      level: "8",
      power: 67,
      skill: [
        {
          id: "barrierall",
          x: "2",
        },
        {
          id: "strike",
          x: "4",
        },
        {
          id: "leech",
          x: "7",
        },
      ],
    },
    {
      health: "44",
      level: "9",
      power: 68,
      skill: [
        {
          id: "barrierall",
          x: "2",
        },
        {
          id: "strike",
          x: "5",
        },
        {
          id: "leech",
          x: "7",
        },
      ],
    },
    {
      attack: "9",
      health: "45",
      level: "10",
      power: 72,
      skill: [
        {
          id: "barrierall",
          x: "2",
        },
        {
          id: "strike",
          x: "5",
        },
        {
          id: "leech",
          x: "8",
        },
      ],
    },
    {
      health: "47",
      level: "11",
      power: 74,
      skill: [
        {
          id: "barrierall",
          x: "2",
        },
        {
          id: "strike",
          x: "5",
        },
        {
          id: "leech",
          x: "9",
        },
      ],
    },
    {
      health: "49",
      level: "12",
      power: 76,
      skill: [
        {
          id: "barrierall",
          x: "2",
        },
        {
          id: "strike",
          x: "6",
        },
        {
          id: "leech",
          x: "9",
        },
      ],
    },
    {
      health: "52",
      level: "13",
      power: 79,
      skill: [
        {
          id: "barrierall",
          x: "2",
        },
        {
          id: "strike",
          x: "6",
        },
        {
          id: "leech",
          x: "10",
        },
      ],
    },
    {
      attack: "10",
      health: "54",
      level: "14",
      power: 84,
      skill: [
        {
          id: "barrierall",
          x: "2",
        },
        {
          id: "strike",
          x: "7",
        },
        {
          id: "leech",
          x: "10",
        },
      ],
    },
    {
      health: "56",
      level: "15",
      power: 86,
      skill: [
        {
          id: "barrierall",
          x: "2",
        },
        {
          id: "strike",
          x: "7",
        },
        {
          id: "leech",
          x: "11",
        },
      ],
    },
    {
      attack: "11",
      health: "58",
      level: "16",
      power: 91,
    },
    {
      health: "59",
      level: "17",
      power: 92,
      skill: [
        {
          id: "barrierall",
          x: "3",
        },
        {
          id: "strike",
          x: "8",
        },
        {
          id: "leech",
          x: "11",
        },
      ],
    },
    {
      health: "61",
      level: "18",
      power: 94,
      skill: [
        {
          id: "barrierall",
          x: "3",
        },
        {
          id: "strike",
          x: "9",
        },
        {
          id: "leech",
          x: "12",
        },
      ],
    },
  ],
});

const combosRequestHandler: HttpHandler = successfulGetHandler(
  ENDPOINTS.COMBOS,
  { "10009~10051": "15178|" },
);

const handlers: HttpHandler[] = [cardsRequestHandler, combosRequestHandler];

export { handlers };
