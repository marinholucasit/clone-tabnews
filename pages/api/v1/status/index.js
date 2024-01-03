import database from "infra/database.js";

async function status(request, response) {
  const result = await database.query("SELECT 1 + 1 as SUM");

  response.status(200).json({ chave: "Deu certo" });
}

export default status;
