import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";
import bcrypt from "bcryptjs";
import { users } from "@shared/models/auth";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true, // Auto-create session table if needed
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || "dev_secret_key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // False for local HTTP
      maxAge: sessionTtl,
    },
  });
}

export function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy Setup
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await authStorage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, cb) => cb(null, user.id));
  passport.deserializeUser(async (id: string, cb) => {
    try {
      if (!id) return cb(null, false);

      // Make sure id is a string (DB may return numbers)
      const userId = String(id);
      const user = await authStorage.getUser(userId);

      // Normalize to a consistent shape so routes can rely on either
      // `user.id` (local) or `user.claims.sub` (external providers)
      if (user) {
        // attach claims.sub for compatibility with routes that expect it
        // (don't overwrite if already present)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!user.claims) user.claims = { sub: user.id };
        cb(null, user);
      } else {
        cb(null, false);
      }
    } catch (err) {
      console.error("deserializeUser error:", err);
      cb(err);
    }
  });

  // Login Route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Login failed" });
      req.logIn(user, (err) => {
        if (err) return next(err);
        // Don't return password/hash to the client or logs
        const { password: _p, ...safeUser } = user as any;
        return res.json({ message: "Logged in successfully", user: safeUser });
      });
    })(req, res, next);
  });


 // Register Route
  app.post("/api/register", async (req, res) => {
    try {
      // Destructure new fields from the body
      const { username, password, firstName, lastName, email } = req.body; //
      
      if (!username || !password) {
         return res.status(400).json({ message: "Username and password required" });
      }

      const existingUser = await authStorage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Save all fields to the database
      const newUser = await authStorage.createUser({
        username,
        password: hashedPassword,
        firstName, // Added
        lastName,  // Added
        email,     // Added
        profileImageUrl: `https://ui-avatars.com/api/?name=${username}`,
      });
      
      req.logIn(newUser, (err) => {
        if (err) throw err;
        const { password: _p, ...safeUser } = newUser as any;
        return res.status(201).json({ message: "Registered successfully", user: safeUser });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Logout Route
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Logged out" });
    });
  });
}

// Simplified Middleware
export const isAuthenticated: RequestHandler = (req, res, next) => {
  // defend against req not having passport helpers attached
  if (typeof (req as any).isAuthenticated === "function" && (req as any).isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
