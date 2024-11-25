const express = require("express");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: "http://localhost:5173", // Adjust if your frontend is hosted elsewhere
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
app.use(express.json());

// PostgreSQL Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Default Route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Register User
app.post("/register", async (req, res) => {
  const {
    Nombre_Usuario,
    Contraseña,
    Rol,
    Pais,
    Telefono,
    Correo_Electronico,
    Nombre_Auditor,
    Especializacion,
    Certificaciones,
    Nombre_Empresa,
    Tipo,
    No_Registro,
    Ubicacion,
    Nombre_Representante,
    Cargo_Representante,
  } = req.body;

  try {
    // Validate common fields
    if (!Nombre_Usuario || !Contraseña || !Rol || !Pais || !Telefono || !Correo_Electronico) {
      return res.status(400).json({ error: "Missing required fields for user registration" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Contraseña, 10);

    // Insert into USUARIO table
    const usuarioResult = await pool.query(
      `INSERT INTO public."USUARIO" ("Nombre_Usuario", "Contraseña", "Rol", "Pais", "Telefono", "Correo_Electronico")
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING "ID_Usuario"`,
      [Nombre_Usuario, hashedPassword, Rol, Pais, Telefono, Correo_Electronico]
    );

    const userId = usuarioResult.rows[0].ID_Usuario;

    // Handle role-specific tables
    if (Rol === "Auditor") {
      if (!Nombre_Auditor || !Especializacion || !Certificaciones) {
        return res.status(400).json({ error: "Missing required fields for Auditor role" });
      }

      await pool.query(
        `INSERT INTO public."AUDITOR" ("Nombre_Auditor", "Especializacion", "Certificaciones", "ID_Usuario")
         VALUES ($1, $2, $3, $4)`,
        [Nombre_Auditor, Especializacion, Certificaciones, userId]
      );
    } else if (Rol === "Empresa") {
      if (!Nombre_Empresa || !Tipo || !No_Registro || !Ubicacion || !Nombre_Representante || !Cargo_Representante) {
        return res.status(400).json({ error: "Missing required fields for Empresa role" });
      }

      await pool.query(
        `INSERT INTO public."EMPRESA" ("Nombre_Empresa", "Tipo", "No_Registro", "Ubicacion", "Nombre_Representante", "Cargo_Representante", "ID_Usuario")
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          Nombre_Empresa,
          Tipo,
          No_Registro,
          Ubicacion,
          Nombre_Representante,
          Cargo_Representante,
          userId,
        ]
      );
    } else {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
