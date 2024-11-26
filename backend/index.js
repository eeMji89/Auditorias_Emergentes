const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

let db;
client
  .connect()
  .then(() => {
    db = client.db("AuditoriasE");
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Middleware
app.use(cors({ origin: "http://localhost:5173", methods: "GET,POST" }));
app.use(express.json());

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
    // Validate required fields
    if (!Nombre_Usuario || !Contraseña || !Rol || !Pais || !Telefono || !Correo_Electronico) {
      return res.status(400).json({ error: "Missing required fields for user registration" });
    }

    if (!db) {
      return res.status(500).json({ error: "Database not initialized" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Contraseña, 10);

    // Insert user
    const user = {
      Nombre_Usuario,
      Contraseña: hashedPassword,
      Rol,
      Pais,
      Telefono,
      Correo_Electronico,
    };
    const result = await db.collection("usuarios").insertOne(user);
    const userId = result.insertedId;

    // Insert role-specific data
    if (Rol === "Auditor") {
      if (!Nombre_Auditor || !Especializacion || !Certificaciones) {
        return res.status(400).json({ error: "Missing required fields for Auditor role" });
      }

      await db.collection("auditores").insertOne({
        Nombre_Auditor,
        Especializacion,
        Certificaciones,
        UsuarioId: userId,
      });
    } else if (Rol === "Empresa") {
      if (!Nombre_Empresa || !Tipo || !No_Registro || !Ubicacion || !Nombre_Representante || !Cargo_Representante) {
        return res.status(400).json({ error: "Missing required fields for Empresa role" });
      }

      await db.collection("empresas").insertOne({
        Nombre_Empresa,
        Tipo,
        No_Registro,
        Ubicacion,
        Nombre_Representante,
        Cargo_Representante,
        UsuarioId: userId,
      });
    } else {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login User
app.post("/login", async (req, res) => {
  const { Nombre_Usuario, Contraseña } = req.body;

  try {
    if (!db) {
      return res.status(500).json({ error: "Database not initialized" });
    }

    // Find the user
    const user = await db.collection("usuarios").findOne({ Nombre_Usuario });
    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(Contraseña, user.Contraseña);
    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.Rol },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, message: "Inicio de sesión exitoso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
