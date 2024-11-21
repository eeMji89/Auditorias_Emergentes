const express = require("express");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON payloads

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// PostgreSQL Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Register User
app.post("/register", async (req, res) => {
  const {
    Nombre_Usuario,
    Contraseña,
    Rol, // Either 'Auditor' or 'Empresa'
    Pais,
    Telefono,
    Correo_Electronico,
    // Auditor-specific
    Nombre_Auditor,
    Telefono_Auditor,
    Especializacion,
    Certificaciones,
    // Empresa-specific
    Nombre_Empresa,
    Tipo,
    No_Registro,
    Ubicacion,
    Nombre_Representante,
    Cargo_Representante,
  } = req.body;

  try {
    // Validate role
    if (Rol !== "Auditor" && Rol !== "Empresa") {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Contraseña, 10);

    // Insert into USUARIO
    const usuarioResult = await pool.query(
      `INSERT INTO public."USUARIO" ("Nombre_Usuario", "Contraseña", "Rol", "Pais", "Telefono", "Correo_Electronico")
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING "ID_Usuario"`,
      [Nombre_Usuario, hashedPassword, Rol, Pais, Telefono, Correo_Electronico]
    );

    const userId = usuarioResult.rows[0].ID_Usuario;

    // Insert into either AUDITOR or EMPRESA based on role
    if (Rol === "Auditor") {
      await pool.query(
        `INSERT INTO public."AUDITOR" ("Nombre_Auditor", "Telefono_Auditor", "Especializacion", "Certificaciones", "ID_Usuario")
         VALUES ($1, $2, $3, $4, $5)`,
        [Nombre_Auditor, Telefono_Auditor, Especializacion, Certificaciones, userId]
      );
    } else if (Rol === "Empresa") {
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
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Sign-In Endpoint
app.post("/signin", async (req, res) => {
  const { Nombre_Usuario, Contraseña } = req.body;

  try {
    // Fetch user by username
    const userResult = await pool.query(
      `SELECT * FROM public."USUARIO" WHERE "Nombre_Usuario" = $1`,
      [Nombre_Usuario]
    );

    // Check if user exists
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = userResult.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(Contraseña, user.Contraseña);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        ID_Usuario: user.ID_Usuario,
        Rol: user.Rol,
        Nombre_Usuario: user.Nombre_Usuario,
      },
      process.env.JWT_SECRET || "your_jwt_secret", // Replace with a strong secret key
      { expiresIn: "1h" }
    );

    // Respond with user data and token
    res.status(200).json({
      message: "Sign-in successful",
      token,
      role: user.Rol,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

