/*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
 
import express from "express";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import router from "./routes/index.js";
import fs from "fs";
import hbs from "hbs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const viewsDir = path.join(__dirname, "views");
const partialsDir = path.join(viewsDir, "partials");
const publicDir = path.join(__dirname, "public");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

app.use(
  session({
    secret: "xianfire-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// Flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// XianFire template engine
app.engine("xian", (filePath, options, callback) => {
  hbs.__express(filePath, options, callback);
});

app.set("views", viewsDir);
app.set("view engine", "xian");

// Register template partials before serving requests
if (fs.existsSync(partialsDir)) {
  const files = fs.readdirSync(partialsDir);

  files
    .filter((file) => file.endsWith(".xian"))
    .forEach((file) => {
      const partialName = file.replace(/\.xian$/, "");
      const fullPath = path.join(partialsDir, file);
      const content = fs.readFileSync(fullPath, "utf8");

      hbs.registerPartial(partialName, content);
    });
} else {
  console.warn("Warning: views/partials folder was not found.");
}

// Routes
app.use("/", router);

// Start server
if (!process.env.ELECTRON) {
  app.listen(PORT, () => {
    console.log(`🔥 XianFire running at http://localhost:${PORT}`);
  });
}

export default app;
