import express, { Express, Request, Response } from "express";
const app: Express = express();
const port = 3000;

type Cat = {
  name: string;
  age: number;
};

const cats: Cat[] = [
  {
    name: "fru",
    age: 3,
  },
  {
    name: "simba",
    age: 1,
  },
];

app.get("/", (req: Request, res: Response) => {
  res.send(cats);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
