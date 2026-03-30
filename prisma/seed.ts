import { PrismaClient, GameStatus } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const seedConnectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!seedConnectionString) {
  throw new Error(
    "DIRECT_URL or DATABASE_URL is required to run the Prisma seed."
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: seedConnectionString,
  }),
});

const demoUser = {
  email: "player1@gameflow.dev",
  name: "Player One",
  image: null,
};

const games = [
  {
    externalId: "igdb-hades",
    title: "Hades",
    slug: "hades",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.webp",
    releaseDate: new Date("2020-09-17T00:00:00.000Z"),
    genres: ["Roguelike", "Action"],
    platforms: ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X|S"],
    rating: 9.3,
  },
  {
    externalId: "igdb-balatro",
    title: "Balatro",
    slug: "balatro",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co6x7v.webp",
    releaseDate: new Date("2024-02-20T00:00:00.000Z"),
    genres: ["Card Game", "Roguelike", "Strategy"],
    platforms: ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X|S"],
    rating: 9.0,
  },
  {
    externalId: "igdb-cyberpunk-2077",
    title: "Cyberpunk 2077",
    slug: "cyberpunk-2077",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co7497.webp",
    releaseDate: new Date("2020-12-10T00:00:00.000Z"),
    genres: ["RPG", "Open World", "Action"],
    platforms: ["PC", "PlayStation 5", "Xbox Series X|S"],
    rating: 8.7,
  },
  {
    externalId: "igdb-dead-cells",
    title: "Dead Cells",
    slug: "dead-cells",
    coverUrl: null,
    releaseDate: new Date("2018-08-07T00:00:00.000Z"),
    genres: ["Roguelike", "Action", "Platformer"],
    platforms: ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X|S"],
    rating: 8.9,
  },
  {
    externalId: "igdb-slay-the-spire",
    title: "Slay the Spire",
    slug: "slay-the-spire",
    coverUrl: null,
    releaseDate: new Date("2019-01-23T00:00:00.000Z"),
    genres: ["Card Game", "Roguelike", "Strategy"],
    platforms: ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X|S"],
    rating: 9.2,
  },
  {
    externalId: "igdb-into-the-breach",
    title: "Into the Breach",
    slug: "into-the-breach",
    coverUrl: null,
    releaseDate: new Date("2018-02-27T00:00:00.000Z"),
    genres: ["Strategy", "Turn-Based Strategy", "Roguelike"],
    platforms: ["PC", "Nintendo Switch", "iOS"],
    rating: 9.1,
  },
  {
    externalId: "igdb-returnal",
    title: "Returnal",
    slug: "returnal",
    coverUrl: null,
    releaseDate: new Date("2021-04-30T00:00:00.000Z"),
    genres: ["Roguelike", "Shooter", "Action"],
    platforms: ["PlayStation 5", "PC"],
    rating: 8.8,
  },
  {
    externalId: "igdb-monster-train",
    title: "Monster Train",
    slug: "monster-train",
    coverUrl: null,
    releaseDate: new Date("2020-05-21T00:00:00.000Z"),
    genres: ["Card Game", "Strategy", "Roguelike"],
    platforms: ["PC", "Nintendo Switch", "Xbox Series X|S"],
    rating: 8.6,
  },
  {
    externalId: "igdb-inscryption",
    title: "Inscryption",
    slug: "inscryption",
    coverUrl: null,
    releaseDate: new Date("2021-10-19T00:00:00.000Z"),
    genres: ["Card Game", "Strategy", "Horror"],
    platforms: ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X|S"],
    rating: 8.8,
  },
  {
    externalId: "igdb-risk-of-rain-2",
    title: "Risk of Rain 2",
    slug: "risk-of-rain-2",
    coverUrl: null,
    releaseDate: new Date("2020-08-11T00:00:00.000Z"),
    genres: ["Roguelike", "Shooter", "Action"],
    platforms: ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X|S"],
    rating: 8.9,
  },
  {
    externalId: "igdb-vampire-survivors",
    title: "Vampire Survivors",
    slug: "vampire-survivors",
    coverUrl: null,
    releaseDate: new Date("2022-10-20T00:00:00.000Z"),
    genres: ["Roguelike", "Action"],
    platforms: ["PC", "Nintendo Switch", "Xbox Series X|S", "iOS"],
    rating: 8.7,
  },
  {
    externalId: "igdb-the-binding-of-isaac-rebirth",
    title: "The Binding of Isaac: Rebirth",
    slug: "the-binding-of-isaac-rebirth",
    coverUrl: null,
    releaseDate: new Date("2014-11-04T00:00:00.000Z"),
    genres: ["Roguelike", "Shooter", "Action"],
    platforms: ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X|S"],
    rating: 8.6,
  },
  {
    externalId: "igdb-hollow-knight",
    title: "Hollow Knight",
    slug: "hollow-knight",
    coverUrl: null,
    releaseDate: new Date("2017-02-24T00:00:00.000Z"),
    genres: ["Action", "Metroidvania"],
    platforms: ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X|S"],
    rating: 9.1,
  },
  {
    externalId: "igdb-persona-5-royal",
    title: "Persona 5 Royal",
    slug: "persona-5-royal",
    coverUrl: null,
    releaseDate: new Date("2020-03-31T00:00:00.000Z"),
    genres: ["RPG", "Turn-Based Strategy"],
    platforms: ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X|S"],
    rating: 9.4,
  },
  {
    externalId: "igdb-disco-elysium",
    title: "Disco Elysium",
    slug: "disco-elysium",
    coverUrl: null,
    releaseDate: new Date("2019-10-15T00:00:00.000Z"),
    genres: ["RPG"],
    platforms: ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X|S"],
    rating: 9.6,
  },
  {
    externalId: "igdb-xcom-2",
    title: "XCOM 2",
    slug: "xcom-2",
    coverUrl: null,
    releaseDate: new Date("2016-02-05T00:00:00.000Z"),
    genres: ["Strategy", "Turn-Based Strategy"],
    platforms: ["PC", "PlayStation 5", "Xbox Series X|S", "iOS"],
    rating: 8.9,
  },
];

const entries = [
  {
    externalId: "igdb-hades",
    status: GameStatus.COMPLETED,
    userRating: 10,
    notes: "Excellent combat loop and a great fit for short sessions.",
    priority: null,
  },
  {
    externalId: "igdb-balatro",
    status: GameStatus.PLAYING,
    userRating: 9,
    notes: "Perfect for the 'What Should I Play Tonight' flow.",
    priority: 1,
  },
  {
    externalId: "igdb-cyberpunk-2077",
    status: GameStatus.BACKLOG,
    userRating: null,
    notes: "Save for a longer weekend session.",
    priority: 2,
  },
];

async function main() {
  const user = await prisma.user.upsert({
    where: { email: demoUser.email },
    update: demoUser,
    create: demoUser,
  });

  const persistedGames = new Map();

  for (const game of games) {
    const record = await prisma.game.upsert({
      where: { externalId: game.externalId },
      update: game,
      create: game,
    });

    persistedGames.set(game.externalId, record);
  }

  for (const entry of entries) {
    const game = persistedGames.get(entry.externalId);

    if (!game) {
      throw new Error(`Game ${entry.externalId} was not seeded correctly.`);
    }

    await prisma.userGameEntry.upsert({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: game.id,
        },
      },
      update: {
        status: entry.status,
        userRating: entry.userRating,
        notes: entry.notes,
        priority: entry.priority,
      },
      create: {
        userId: user.id,
        gameId: game.id,
        status: entry.status,
        userRating: entry.userRating,
        notes: entry.notes,
        priority: entry.priority,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed.", error);
    await prisma.$disconnect();
    process.exit(1);
  });
