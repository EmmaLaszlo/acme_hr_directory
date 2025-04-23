const express = require("express");
const { Client } = require("pg");

const client = new Client({
  user: "emmalaslo", // user
  host: "localhost",
  database: "acme_hr_db", //  new DB
  port: 5432,
});

const app = express();
const port = 3000;

app.use(express.json());

client.connect();

// Routes will go here...

// fetch employee table
app.get("/api/employees", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM employees");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send({ error: "Error fetching employees" });
  }
});

// Passed the postman check!

// fetch department table
app.get("/api/departments", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM departments");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send({ error: "Error fetching departments" });
  }
});

// Passed the postman check!

// add an employee
app.post("/api/employees", async (req, res) => {
  const { name, department_id } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO employees (name, department_id) VALUES ($1, $2) RETURNING *",
      [name, department_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send({ error: "Error creating employee" });
  }
});

// Passed the postman check!

// delete an employee
app.delete("/api/employees/:id", async (req, res) => {
  try {
    await client.query("DELETE FROM employees WHERE id = $1", [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send({ error: "Error deleting employee" });
  }
});

// Passed the postman check!

// update an employee
app.put("/api/employees/:id", async (req, res) => {
  const { name, department_id } = req.body;
  try {
    const result = await client.query(
      "UPDATE employees SET name = $1, department_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [name, department_id, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send({ error: "Error updating employee" });
  }
});

// Passed the postman check!

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
