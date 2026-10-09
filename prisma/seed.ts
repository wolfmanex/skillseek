import { PrismaClient, type Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { TRADES } from "../src/lib/constants";

const db = new PrismaClient();

async function seedTrades() {
  for (const trade of TRADES) {
    await db.trade.upsert({ where: { slug: trade.slug }, create: trade, update: trade });
  }
  console.log(`Seeded ${TRADES.length} trades`);
}

type DemoUser = {
  email: string;
  role: Role;
  isAdmin?: boolean;
  profile: {
    displayName: string;
    companyName?: string;
    regCode?: string;
    bio: string;
    country: string;
    serviceCountries?: string[];
    certifications?: string[];
    yearsExperience?: number;
    hourlyRate?: number;
    available?: boolean;
    verified?: boolean;
  };
  trades: string[];
};

const DEMO_USERS: DemoUser[] = [
  {
    email: "admin@skillseek.test",
    role: "CONTRACTOR",
    isAdmin: true,
    profile: {
      displayName: "Mari Tamm",
      companyName: "Põhjaehitus OÜ",
      regCode: "12345678",
      bio: "General contractor for residential and commercial buildings in Harjumaa.",
      country: "EE",
      verified: true,
    },
    trades: ["general-construction"],
  },
  {
    email: "elekter@skillseek.test",
    role: "SUBCONTRACTOR",
    profile: {
      displayName: "Andres Kask",
      companyName: "Volt Elekter OÜ",
      regCode: "14567890",
      bio: "Electrical installation for apartment buildings and offices. Crew of 8.",
      country: "EE",
      serviceCountries: ["EE", "LV", "FI"],
      certifications: ["Electrician level 5", "Working at height"],
      yearsExperience: 12,
      verified: true,
    },
    trades: ["electrical"],
  },
  {
    email: "toru@skillseek.test",
    role: "SUBCONTRACTOR",
    profile: {
      displayName: "Kalle Mets",
      companyName: "Tartu Torutööd OÜ",
      regCode: "11223344",
      bio: "Plumbing and heating for new builds and renovations.",
      country: "EE",
      serviceCountries: ["EE", "LV"],
      yearsExperience: 9,
    },
    trades: ["plumbing", "hvac"],
  },
  {
    email: "plaatija@skillseek.test",
    role: "SPECIALIST",
    profile: {
      displayName: "Jaan Saar",
      bio: "Tiler with 15 years of experience. Bathrooms, kitchens, large-format tiles.",
      country: "EE",
      serviceCountries: ["EE", "FI"],
      yearsExperience: 15,
      hourlyRate: 28,
    },
    trades: ["tiling", "flooring"],
  },
  {
    email: "keevitaja@skillseek.test",
    role: "SPECIALIST",
    profile: {
      displayName: "Ivan Petrov",
      bio: "Certified welder, steel structures and railings.",
      country: "EE",
      serviceCountries: ["EE", "LV", "LT"],
      certifications: ["EN ISO 9606-1", "Working at height"],
      yearsExperience: 20,
      hourlyRate: 32,
      verified: true,
    },
    trades: ["welding"],
  },
  {
    email: "puusepp@skillseek.test",
    role: "SPECIALIST",
    profile: {
      displayName: "Mikko Virtanen",
      bio: "Carpenter based in Helsinki: roof structures, terraces, interior finishing. Works in Estonia too.",
      country: "FI",
      serviceCountries: ["FI", "EE"],
      yearsExperience: 7,
      hourlyRate: 25,
      available: false,
    },
    trades: ["carpentry", "roofing"],
  },
];

async function seedDemo() {
  const passwordHash = await bcrypt.hash("demo1234", 10);
  const ids: Record<string, string> = {};
  for (const u of DEMO_USERS) {
    const profile = { ...u.profile, trades: { connect: u.trades.map((slug) => ({ slug })) } };
    const user = await db.user.upsert({
      where: { email: u.email },
      create: { email: u.email, role: u.role, isAdmin: u.isAdmin ?? false, passwordHash, profile: { create: profile } },
      update: {},
    });
    ids[u.email] = user.id;
  }

  if (await db.posting.count({ where: { authorId: ids["admin@skillseek.test"] } })) {
    console.log("Demo postings already exist, skipping");
    return;
  }

  const day = 24 * 60 * 60 * 1000;
  const electrical = await db.posting.create({
    data: {
      authorId: ids["admin@skillseek.test"],
      title: "Electrical installation for a 24-unit apartment building",
      description:
        "New 4-storey apartment building in Tallinn (Kristiine). Full electrical installation: wiring, distribution boards, lighting, low-voltage. Drawings available.",
      country: "EE",
      city: "Tallinn",
      startDate: new Date(Date.now() + 30 * day),
      endDate: new Date(Date.now() + 150 * day),
      budgetMin: 80000,
      budgetMax: 110000,
      seeking: "SUBCONTRACTOR",
      requiredCerts: ["Electrician level 5"],
      trades: { connect: [{ slug: "electrical" }] },
    },
  });
  await db.posting.create({
    data: {
      authorId: ids["admin@skillseek.test"],
      title: "Bathroom tiling, 12 apartments",
      description: "Wall and floor tiling in 12 bathrooms, approx. 450 m². Materials provided.",
      country: "EE",
      city: "Tallinn",
      startDate: new Date(Date.now() + 45 * day),
      budgetMax: 18000,
      seeking: "SPECIALIST",
      trades: { connect: [{ slug: "tiling" }] },
    },
  });
  await db.posting.create({
    data: {
      authorId: ids["elekter@skillseek.test"],
      title: "Welder needed for cable tray supports",
      description: "Two weeks of steel support fabrication on site in Rakvere.",
      country: "EE",
      city: "Rakvere",
      startDate: new Date(Date.now() + 14 * day),
      seeking: "SPECIALIST",
      requiredCerts: ["EN ISO 9606-1"],
      trades: { connect: [{ slug: "welding" }] },
    },
  });
  const done = await db.posting.create({
    data: {
      authorId: ids["admin@skillseek.test"],
      title: "Steel railings for office building",
      description: "Fabrication and installation of stair railings.",
      country: "EE",
      status: "COMPLETED",
      seeking: "SPECIALIST",
      trades: { connect: [{ slug: "welding" }] },
    },
  });

  const app = await db.application.create({
    data: {
      postingId: electrical.id,
      applicantId: ids["elekter@skillseek.test"],
      message: "We have a free crew from next month and have done similar buildings in Tallinn.",
      status: "SHORTLISTED",
    },
  });
  await db.message.createMany({
    data: [
      { applicationId: app.id, senderId: ids["elekter@skillseek.test"], body: "We have a free crew from next month and have done similar buildings in Tallinn." },
      { applicationId: app.id, senderId: ids["admin@skillseek.test"], body: "Sounds good. Can you send a rough price based on the drawings?" },
    ],
  });
  await db.application.create({
    data: { postingId: done.id, applicantId: ids["keevitaja@skillseek.test"], status: "ACCEPTED" },
  });
  await db.review.create({
    data: {
      postingId: done.id,
      authorId: ids["admin@skillseek.test"],
      subjectId: ids["keevitaja@skillseek.test"],
      rating: 5,
      comment: "Precise work and finished ahead of schedule.",
    },
  });
  console.log("Seeded demo users (password: demo1234), postings, a conversation and a review");
}

async function main() {
  await seedTrades();
  if (process.argv.includes("--demo") || process.env.SEED_DEMO === "1") await seedDemo();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
