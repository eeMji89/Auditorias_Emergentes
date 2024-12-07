/* eslint-disable no-undef */
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
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
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Default Route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const uploadsPath = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

console.log(`Serving uploads from: ${uploadsPath}`);

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,path.join(__dirname, "../uploads")); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // File name with timestamp
  },
});
const upload = multer({storage}); // Allow up to 10 files

  const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token received:", token);
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }
  
    try {
      // Check if token is blacklisted
      const blacklistedToken = await db.collection("blacklistedTokens").findOne({ token });
      if (blacklistedToken) {
        return res.status(401).json({ error: "Token is invalid (blacklisted)" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
      req.user = decoded; // Attach user info to request
      console.log("Decoded token:", decoded);
      next();
    } catch (err) {
      console.error("Authentication error:", err);
      res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  };
  
  // Routes
  app.get("/userauth", authenticateToken, async (req, res) => {
    try {
      const userId = new ObjectId(req.user.userId);
      const user = await db.collection("usuarios").findOne({ _id: userId });
      if (!user) {
        console.error("User not found for ID:", req.user.userId);
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({ username: user.Nombre_Usuario, role: user.Rol });
    } catch (err) {
      console.error("Error in /userauthfile:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  app.post("/login", async (req, res) => {
    const { Nombre_Usuario, Contrasena } = req.body;
  
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
      const isMatch = await bcrypt.compare(Contrasena, user.Contrasena);
      if (!isMatch) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }
  
      // Generate JWT
      const token = jwt.sign(
        { userId: user._id.toString(), role: user.Rol },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "48h" }
      );
  
      res.status(200).json({ token, message: "Inicio de sesión exitoso" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error del servidor" });
    }
  });

  app.put("/update-password/:id", async (req, res) => {
    const userId = req.params.id; // User ID from the URL parameter
    const { currentPassword, newPassword } = req.body;
  
    try {
      if (!db) {
        return res.status(500).json({ error: "Database not initialized" });
      }
  
      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new passwords are required" });
      }
  
      // Find the user
      const user = await db.collection("usuarios").findOne({ _id: new MongoClient.ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Validate the current password
      const isMatch = await bcrypt.compare(currentPassword, user.Contrasena);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the password
      await db.collection("usuarios").updateOne(
        { _id: new MongoClient.ObjectId(userId) },
        { $set: { Contrasena: hashedPassword } }
      );
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
  app.post("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
    if (!token) {
      return res.status(400).json({ error: "Token missing from request" });
    }
  
    try {
      // Save token to the blacklist with expiration time
      await db.collection("blacklistedTokens").insertOne({
        token,
        expiresAt: new Date(Date.now() + 3600 * 1000), // Match the token expiration time
      });
  
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Internal Server Error during logout" });
    }
  });

// Register User
app.post("/register", upload.array("Certificaciones", 10), async (req, res) => {
  console.log("Files received:", req.files); // Log received files
  console.log("Body received:", req.body);
  const {
    Nombre_Usuario,
    Contrasena,
    Rol,
    Pais,
    Telefono,
    Correo_Electronico,
    Nombre_Auditor,
    Especializacion,
    Nombre_Empresa,
    Tipo,
    No_Registro,
    Ubicacion,
    Nombre_Representante,
    Cargo_Representante,
  } = req.body;
  console.log("Files Received:", req.files); // Debug: Check uploaded files
  console.log("Body:", req.body);
  try {
    // Validate required fields
    if (!Nombre_Usuario || !Contrasena || !Rol || !Pais || !Telefono || !Correo_Electronico) {
      console.log("Missing fields:", { Nombre_Usuario, Contrasena, Rol, Pais, Telefono, Correo_Electronico });
      return res.status(400).json({ error: "Missing required fields for user registration" });
    }

    if (!db) {
      return res.status(500).json({ error: "Database not initialized" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Contrasena, 10);

    // Insert user
    const user = {
      Nombre_Usuario,
      Contrasena: hashedPassword,
      Rol,
      Pais,
      Telefono,
      Correo_Electronico,
    };
    const result = await db.collection("usuarios").insertOne(user);
    const userId = result.insertedId;

    // Insert role-specific data
    if (Rol === "Auditor") {
      if (!Nombre_Auditor || !Especializacion) {
        return res.status(400).json({ error: "Missing required fields for Auditor role" });
      }
      let certificaciones = [];
      if (req.files && req.files.length > 0) {
        certificaciones = req.files.map((file) => ({
          fileName: file.originalname,
          filePath: file.path,
          fileType: file.mimetype,
          fileUrl: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
          uploadDate: new Date(),
        }));
      } else {
        return res.status(400).json({ error: "At least one certification file is required for Auditor role" });
      }
      
      
      await db.collection("auditores").insertOne({
        Nombre_Auditor,
        Especializacion,
        Certificaciones: certificaciones,
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


app.get("/auditores", authenticateToken, async (req, res) => {
  try {
    const auditors = await db.collection("auditores").find().toArray();
    res.status(200).json({ success: true, data: auditors });
  } catch (err) {
    console.error("Error fetching auditors:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// Get Auditor by ID
app.get("/auditores/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const auditor = await db.collection("auditores").findOne({ _id: new ObjectId(id) });

    if (!auditor) {
      return res.status(404).json({ error: "Auditor not found" });
    }

    const user = await db.collection("usuarios").findOne({ _id: new ObjectId(auditor.UsuarioId) });

    const host = req.get("host"); // Get the host (e.g., localhost:5000)
    const protocol = req.protocol; // Get the protocol (http or https)

    const certificacionesWithUrls = auditor.Certificaciones.map((cert) => ({
      ...cert,
      fileUrl: `${protocol}://${host}/uploads/${cert.fileName}`,
    }));

    res.status(200).json({
      ...auditor,
      Certificaciones: certificacionesWithUrls,
      Correo_Electronico: user?.Correo_Electronico || null,
      Telefono: user?.Telefono || null,
      Pais: user?.Pais || null,
    });
      } catch (err) {
    console.error("Error fetching auditor by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put("/auditores/:id",authenticateToken, async (req, res) => {
  const auditorId = req.params.id;
  const { Nombre_Auditor, Especializacion, Certificaciones, Pais, Telefono, Correo_Electronico } = req.body;

  try {
    if (!db) {
      return res.status(500).json({ error: "Database not initialized" });
    }

    // Ensure the auditor exists
    const auditor = await db.collection("auditores").findOne({ _id: new MongoClient.ObjectId(auditorId) });
    if (!auditor) {
      return res.status(404).json({ error: "Auditor not found" });
    }

    // Update certifications if provided
    let updatedCertifications = auditor.Certificaciones || [];
    if (Certificaciones && Certificaciones.length > 0) {
      updatedCertifications = [...updatedCertifications, ...Certificaciones];
    }

    // Update auditor-specific data
    await db.collection("auditores").updateOne(
      { _id: new MongoClient.ObjectId(auditorId) },
      {
        $set: {
          Nombre_Auditor,
          Especializacion,
          Certificaciones: updatedCertifications,
        },
      }
    );

    // Update user-level data
    await db.collection("usuarios").updateOne(
      { _id: new MongoClient.ObjectId(auditor.UsuarioId) },
      {
        $set: { Pais, Telefono, Correo_Electronico },
      }
    );

    res.status(200).json({ message: "Auditor updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get All Empresas
app.get("/empresas",authenticateToken, async (req, res) => {
  try {
    const empresas = await db.collection("empresas").find().toArray();
    res.status(200).json(empresas);
  } catch (err) {
    console.error("Error fetching empresas:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Empresa by ID
app.get("/empresas/:id",authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const empresa = await db.collection("empresas").findOne({ _id: new ObjectId(id) });

    if (!empresa) {
      return res.status(404).json({ error: "Empresa not found" });
    }

    res.status(200).json(empresa);
  } catch (err) {
    console.error("Error fetching empresa by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/empresas/:id",authenticateToken, async (req, res) => {
  const empresaId = req.params.id;
  const {
    Nombre_Empresa,
    Tipo,
    No_Registro,
    Ubicacion,
    Nombre_Representante,
    Cargo_Representante,
    Pais,
    Telefono,
    Correo_Electronico,
  } = req.body;

  try {
    if (!db) {
      return res.status(500).json({ error: "Database not initialized" });
    }

    // Ensure the empresa exists
    const empresa = await db.collection("empresas").findOne({ _id: new MongoClient.ObjectId(empresaId) });
    if (!empresa) {
      return res.status(404).json({ error: "Empresa not found" });
    }

    // Update empresa-specific data
    await db.collection("empresas").updateOne(
      { _id: new MongoClient.ObjectId(empresaId) },
      {
        $set: {
          Nombre_Empresa,
          Tipo,
          No_Registro,
          Ubicacion,
          Nombre_Representante,
          Cargo_Representante,
        },
      }
    );

    // Update user-level data
    await db.collection("usuarios").updateOne(
      { _id: new MongoClient.ObjectId(empresa.UsuarioId) },
      {
        $set: { Pais, Telefono, Correo_Electronico },
      }
    );

    res.status(200).json({ message: "Empresa updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/solicitudes", authenticateToken, async (req, res) => {
  const { ID_Auditor, Fecha, Detalles } = req.body;
  const ID_Empresa = req.user.userId; // Extract the ID of the logged-in user

  try {
    if (!ID_Empresa || !ID_Auditor || !Fecha || !Detalles) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await db.collection("solicitudes").insertOne({
      ID_Empresa,
      ID_Auditor,
      Fecha: new Date(Fecha),
      Detalles,
    });

    res.status(201).json({
      message: "Solicitud created successfully",
      solicitudId: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/solicitudes", authenticateToken, async (req, res) => {
  const { userId, role } = req.user; // Extract userId and role from the token

  try {
    let filter = {};
    if (role === "Empresa") {
      // Filter by Empresa's user ID
      filter = { ID_Empresa: userId };
    } else if (role === "Auditor") {
      // Filter by Auditor's user ID
      filter = { ID_Auditor: userId };
    }

    const solicitudes = await db.collection("solicitudes").find(filter).toArray();
    res.status(200).json(solicitudes);
  } catch (err) {
    console.error("Error fetching solicitudes:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/solicitudes/:id", authenticateToken, async (req, res) => {
  const solicitudId = req.params.id;

  try {
    const solicitud = await db.collection("solicitudes").findOne({
      _id: new MongoClient.ObjectId(solicitudId),
    });

    if (!solicitud) {
      return res.status(404).json({ error: "Solicitud not found" });
    }

    res.status(200).json(solicitud);
  } catch (err) {
    console.error("Error fetching solicitud by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/solicitudes/:id", authenticateToken, async (req, res) => {
  const solicitudId = req.params.id;

  try {
    const result = await db.collection("solicitudes").deleteOne({
      _id: new MongoClient.ObjectId(solicitudId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Solicitud not found" });
    }

    res.status(200).json({ message: "Solicitud deleted successfully" });
  } catch (err) {
    console.error("Error deleting solicitud:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Authentication Middleware


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
