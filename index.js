const { PrismaClient } = require("@prisma/client");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const PORT = 3005;

const prisma = new PrismaClient();

async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });

app.use(cors());

app.get("/athletes", async (req, res) => {
  const { minAge, maxAge, citizen, gender, limit, page, sortBy, sortOrder } =
    req.query;
  let queryParams = {};

  let orderBy = [];
  if (minAge && maxAge) {
    queryParams.age = { gte: parseInt(minAge), lte: parseInt(maxAge) };
  }
  if (citizen && citizen != "all") {
    queryParams.citizen = citizen === "yes";
  }
  if (gender && gender != "all") {
    queryParams.gender = { equals: gender };
  }

  if (sortBy) {
    if (sortBy == "citizen") {
      orderBy.push({ citizen: sortOrder });
    } else if (sortBy == "gender") {
      orderBy.push({ gender: sortOrder });
    } else if (sortBy == "age") {
      orderBy.push({ age: sortOrder });
    }
  }
  let data = {};

  try {
    console.log("Page:", page);
    data = await prisma.athletes.findMany({
      skip: parseInt(page) ? parseInt(page) * (limit || 10) : 0,
      take: limit || 10,
      where: queryParams,
      orderBy: orderBy,
    });
    res.json(data);
  } catch (error) {
    console.error("Error Fetching the data: ", error);
    res.status(500).json({ error: "Internal Server error" });
  }
});

app.listen(PORT, () => {
  console.log("SERVER IS RUNNING");
});
