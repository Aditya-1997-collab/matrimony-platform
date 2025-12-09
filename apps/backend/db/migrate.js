import fs from "fs";
import path from "path";
import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  connectionString: "postgres://postgres:Aditya123@localhost:5432/matrimony_db"
});

const run = async () => {
  await client.connect();
  const folder = process.argv[2]; // e.g. "001_init/up.sql"

  const sql = fs.readFileSync(path.join("db/migrations", folder), "utf8");
  await client.query(sql);

  console.log("Migration completed:", folder);
  await client.end();
};

run();
