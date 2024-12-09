const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const { ethers } = require("ethers")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

//Contract

const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; 
const contractABI = [
  {
    "inputs": [{ "internalType": "bool", "name": "_initialValidity", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  { "inputs": [], "name": "dateCreated", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "isValid", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "bool", "name": "_isValid", "type": "bool" }], "name": "setValidity", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
];


const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY; 
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

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
      let profileId = null;
      if (req.user.role === "Empresa") {
        const empresa = await db.collection("empresas").findOne({ UsuarioId: userId });
        if (empresa) {
          console.log(empresa._id.toString() );
          profileId = empresa._id.toString();
          console.log(profileId);
        }
      } else if (req.user.role === "Auditor") {
        const auditor = await db.collection("auditores").findOne({ UsuarioId:userId});
        if (auditor) {
          profileId = auditor._id.toString();
        }
        console.log(profileId);
      }
    res.json({
      ID: profileId,
      username: user.Nombre_Usuario,
      role: user.Rol,
    });
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

  app.post("/notifications", authenticateToken, async (req, res) => {
    const { recipientId, message, type } = req.body;
  
    try {
      const notification = {
        recipientId,
        message,
        type,
        status: "unread",
        createdAt: new Date(),
      };
      await db.collection("notifications").insertOne(notification);
  
      res.status(201).json({ message: "Notification created successfully" });
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  app.get("/notifications", authenticateToken, async (req, res) => {
    try {
      // Fetch the logged-in user's details to determine their role
      const user = await db.collection("usuarios").findOne({ _id: new ObjectId(req.user.userId) });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Determine whether the user is an Empresa or Auditor
      let recipientId;
      if (user.Rol === "Empresa") {
        const empresa = await db.collection("empresas").findOne({ UsuarioId: new ObjectId(user._id) });
        if (!empresa) {
          return res.status(404).json({ error: "Empresa not found for this user" });
        }
        recipientId = empresa._id.toString();
      } else if (user.Rol === "Auditor") {
        const auditor = await db.collection("auditores").findOne({ UsuarioId: new ObjectId(user._id) });
        if (!auditor) {
          return res.status(404).json({ error: "Auditor not found for this user" });
        }
        recipientId = auditor._id.toString();
      } else {
        return res.status(400).json({ error: "Invalid user role" });
      }
  
      // Fetch notifications for the determined recipientId
      const notifications = await db
        .collection("notifications")
        .find({ recipientId })
        .sort({ createdAt: -1 })
        .toArray();
  
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

  app.put("/notifications/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
  
    try {
      await db
        .collection("notifications")
        .updateOne({ _id: new ObjectId(id) }, { $set: { status: "read" } });
  
      res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error updating notification:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  

  app.put("/updatepassword",authenticateToken, async (req, res) => {
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
      const userId = new ObjectId(req.user.userId); 
      const user = await db.collection("usuarios").findOne({ _id: userId });
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
        { _id: new ObjectId(userId) },
        { $set: { Contrasena: hashedPassword } }
      );
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
  app.post("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; 
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
app.get("/empresas", authenticateToken, async (req, res) => {
  try {
    // Fetch all empresas
    const empresas = await db.collection("empresas").find().toArray();

    // Fetch user data for all empresas
    const userIds = empresas.map((empresa) => new ObjectId(empresa.UsuarioId));
    const users = await db.collection("usuarios").find({ _id: { $in: userIds } }).toArray();

    // Map user data by their IDs for easy lookup
    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = user;
      return map;
    }, {});

    // Enhance empresas with user data
    const empresasWithUserData = empresas.map((empresa) => {
      const user = userMap[empresa.UsuarioId.toString()] || {};
      return {
        ...empresa,
        Correo_Electronico: user.Correo_Electronico || null,
        Telefono: user.Telefono || null,
        Pais: user.Pais || null,
      };
    });

    res.status(200).json(empresasWithUserData);
  } catch (err) {
    console.error("Error fetching empresas:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get Empresa by ID
app.get("/empresas/:id", authenticateToken, async (req, res) => {
  const empresaId = req.params.id;

  try {
    // Fetch the empresa by ID
    const empresa = await db.collection("empresas").findOne({ _id: new ObjectId(empresaId) });

    if (!empresa) {
      return res.status(404).json({ error: "Empresa not found" });
    }

    // Fetch the associated user data
    const user = await db.collection("usuarios").findOne({ _id: new ObjectId(empresa.UsuarioId) });

    res.status(200).json({
      ...empresa,
      Correo_Electronico: user?.Correo_Electronico || null,
      Telefono: user?.Telefono || null,
      Pais: user?.Pais || null,
    });
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
    const empresa = await db.collection("empresas").findOne({ _id: new ObjectId(empresaId) });
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
  const userId = req.user.userId; // Extract the ID of the logged-in user
  console.log("Request body:", req.body); // Log the incoming data
  console.log("User ID:", req.user.userId); // Log the user ID from the token
  try {
    // Validate required fields
    if (!userId || !ID_Auditor || !Fecha || !Detalles) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch the Empresa record based on UsuarioId
    const empresa = await db.collection("empresas").findOne({UsuarioId: new ObjectId(userId)});

    if (!empresa) {
      return res.status(404).json({ error: "Empresa not found for the logged-in user" });
    }

    const ID_Empresa = empresa._id.toString(); // Use the actual _id from the empresa collection

    // Insert the solicitud with the correct Empresa ID
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
    console.error("Error creating solicitud:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/solicitudes", authenticateToken, async (req, res) => {
  const { userId, role } = req.user;
  console.log(role);
  try {
    // Initialize filter based on user role
    let filter = {};
    let userEntity = null;

    if (role === "Empresa") {
      // Find Empresa associated with the logged-in user
      userEntity = await db.collection("empresas").findOne({ UsuarioId: new ObjectId(userId) });
      if (!userEntity) {
        return res.status(404).json({ error: "Empresa not found. Please ensure registration is complete." });
      }
      filter = { ID_Empresa: userEntity._id.toString() };
    } else if (role === "Auditor") {
      // Find Auditor associated with the logged-in user
      userEntity = await db.collection("auditores").findOne({ UsuarioId: new ObjectId(userId) });
      if (!userEntity) {
        return res.status(404).json({ error: "Auditor not found. Please ensure registration is complete." });
      }
      filter = { ID_Auditor: userEntity._id.toString() };
    }
    console.log(filter);
    // Fetch solicitudes using the determined filter
    const solicitudes = await db.collection("solicitudes").find(filter).toArray();
    if (solicitudes.length === 0) {
      return res.status(200).json([]); // Return empty array if no solicitudes found
    }

    // Collect IDs for related Auditors and Empresas
    const auditorIds = solicitudes.map((s) => new ObjectId(s.ID_Auditor));
    const empresaIds = solicitudes.map((s) => new ObjectId(s.ID_Empresa));
    console.log(auditorIds);
    // Fetch related Auditor and Empresa details in parallel
    let auditores = [];
    let empresas = [];
    try {
      [auditores, empresas] = await Promise.all([
        db.collection("auditores").find({ _id: { $in: auditorIds } }).toArray(),
        db.collection("empresas").find({ _id: { $in: empresaIds } }).toArray(),
      ]);
    } catch (fetchError) {
      console.error("Error fetching related entities:", fetchError);
      return res.status(500).json({ error: "Error fetching related entities" });
    }


    // Map Auditor and Empresa names by their IDs
    const auditorMap = Object.fromEntries(auditores.map((a) => [a._id.toString(), a.Nombre_Auditor || "Unknown"]));
    const empresaMap = Object.fromEntries(empresas.map((e) => [e._id.toString(), e.Nombre_Empresa || "Unknown"]));

    // Enhance solicitudes with related names
    const solicitudesWithNames = solicitudes.map((solicitud) => ({
      ...solicitud,
      AuditorName: auditorMap[solicitud.ID_Auditor] || "Unknown",
      EmpresaName: empresaMap[solicitud.ID_Empresa] || "Unknown",
    }));
        console.log("Filter:", filter);
    console.log("Solicitudes:", solicitudes);
    console.log("Auditor IDs:", auditorIds);
    console.log("Empresa IDs:", empresaIds);

    console.log("Solicitudes with names:", solicitudesWithNames);
    res.status(200).json(solicitudesWithNames);
  } catch (err) {
    console.error("Error fetching solicitudes:", err.message);
    return res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
  
});


app.get("/solicitudes/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const solicitud = await db.collection("solicitudes").findOne({ _id: new ObjectId(id) });

    if (!solicitud) {
      return res.status(404).json({ error: "Solicitud not found" });
    }

    // Fetch related Auditor and Empresa in parallel
    const [empresa, auditor] = await Promise.all([
      db.collection("empresas").findOne({ _id: new ObjectId(solicitud.ID_Empresa) }),
      db.collection("auditores").findOne({ _id: new ObjectId(solicitud.ID_Auditor) }),
    ]);

    res.status(200).json({
      ...solicitud,
      EmpresaName: empresa?.Nombre_Empresa || "Unknown",
      AuditorName: auditor?.Nombre_Auditor || "Unknown",
    });
  } catch (error) {
    console.error("Error fetching solicitud details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.delete("/solicitudes/:id", authenticateToken, async (req, res) => {
  const solicitudId = req.params.id;

  try {
    const result = await db.collection("solicitudes").deleteOne({
      _id: new ObjectId(solicitudId),
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

app.post("/auditorias", authenticateToken, async (req, res) => {
  const {
    ID_Auditor,
    ID_Empresa,
    Fecha,
    Estatus,
    Descripcion,
    Salario,
    Horas_Extra,
    Seguro,
    Vacaciones,
    Comentarios
  } = req.body;
  const userId = req.user.userId; // ID del usuario logueado extraído del token

  console.log("Request body:", req.body); // Log de los datos entrantes
  console.log("User ID:", userId); // Log del ID del usuario del token

  try {
    // Validar campos requeridos
    if (!ID_Auditor || !ID_Empresa || !Fecha || !Estatus || !Descripcion) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const empresa = await db.collection("empresas").findOne({_id: new ObjectId(ID_Empresa)});

    if (!empresa) {
      return res.status(404).json({ error: "Empresa not found for the logged-in user" });
    }

    const Id_Empresa = empresa._id.toString(); 
    
    const result = await db.collection("auditorias").insertOne({
      ID_Auditor,
      Id_Empresa,
      Fecha: new Date(Fecha),
      Estatus,
      Descripcion,
      Salario,
      Horas_Extra,
      Seguro,
      Vacaciones,
      Comentarios,
    });

    res.status(201).json({
      message: "Auditoría creada exitosamente",
      auditoriaId: result.insertedId,
    });
  } catch (err) {
    console.error("Error al crear la auditoría:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/auditorias", authenticateToken, async (req, res) => {
  try {
    const auditorias = await db.collection("auditorias").find().toArray();
    res.status(200).json({ success: true, data: auditorias });
  } catch (err) {
    console.error("Error fetching auditors:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/auditorias/:id", authenticateToken, async (req, res) => {
  const { id } = req.params; // ID de la auditoría a buscar

  try {
    // Validar el ID
    if (!id) {
      return res.status(400).json({ error: "ID de auditoría no proporcionado" });
    }

    // Buscar la auditoría en la base de datos
    const auditoria = await db.collection("auditorias").findOne({ _id: new ObjectId(id) });

    if (!auditoria) {
      return res.status(404).json({ error: "Auditoría no encontrada" });
    }

    res.status(200).json(auditoria);
  } catch (err) {
    console.error("Error al obtener la auditoría:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


app.post("/contratos", authenticateToken, async (req, res) => {
  const { userId } = req.user; // Get the authenticated user ID
  const { 
    auditorId, 
    empresaId,  
    DateCreated,
    IsValid
  } = req.body; // IDs for the auditor and empresa

  try {
    const contract = {
      auditorId,
      empresaId,
      dateCreated: new Date(),
      isValid: true,isValid: true,
    };

    const result = await db.collection("contratos").insertOne(contract);

    res.status(201).json({ message: "Contract created successfully", contractId: result.insertedId });
  } catch (err) {
    console.error("Error creating contract:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Retrieve All Contracts
app.get("/contratos", authenticateToken, async (req, res) => {
  try {
    const contracts = await db.collection("contratos").find().toArray();
    res.status(200).json(contracts);
  } catch (err) {
    console.error("Error fetching contracts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Contract Validity
app.put("/contratos/:id", authenticateToken, async (req, res) => {
  const { id } = req.params; // Contract ID
  const { isValid } = req.body; // New validity status

  try {
    const result = await db
      .collection("contratos")
      .updateOne({ _id: new ObjectId(id) }, { $set: { isValid } });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Contract not found" });
    }

    res.status(200).json({ message: "Contract updated successfully" });
  } catch (err) {
    console.error("Error updating contract:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Retrieve a Contract by ID
app.get("/contratos/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const contract = await db.collection("contratos").findOne({ _id: new ObjectId(id) });

    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    res.status(200).json(contract);
  } catch (err) {
    console.error("Error fetching contract by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Authentication Middleware


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
