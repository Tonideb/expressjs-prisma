import { PrismaClient } from "@prisma/client";
import express from "express";
const cors = require('cors')

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3005;

// Middleware
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.get("/posts", async (req, res) => {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(posts);
});

app.get("/posts/:id", async (req, res) => {
  const post = await prisma.blogPost.findUnique({
    where: { id: Number(req.params.id) },
  });
  res.json(post);
});

app.post("/posts", async (req, res) => {
  const post = await prisma.blogPost.create({
    data: {
      title: req.body.title || "Untitled Post",
      content: req.body.content,
    },
  });
  res.json(post);
});

app.put("/posts/:id", async (req, res) => {
  const post = await prisma.blogPost.update({
    where: { id: Number(req.params.id) },
    data: {
      title: req.body.title,
      content: req.body.content,
    },
  });
  res.json(post);
});

app.delete("/posts/:id", async (req, res) => {
  await prisma.blogPost.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send(`
    <h1>Blog Post API</h1>
    <h2>Endpoints:</h2>
    <pre>
      GET, POST /posts
      GET, PUT, DELETE /posts/:id
    </pre>
  `);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
