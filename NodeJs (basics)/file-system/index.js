// Import required modules
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

// Define the path for the 'data' directory
const dataFolder = path.join(__dirname, "data");

// Create 'data' folder if it doesn't exist
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder);
  console.log("Data folder created");
}

// Define path for sync file
const syncFilePath = path.join(dataFolder, "example.txt");

// ✅ Synchronous File Operations

// Write content to file synchronously
fs.writeFileSync(syncFilePath, "Hello from Node.js");
console.log("File created successfully");

// Read content synchronously
const readContent = fs.readFileSync(syncFilePath, "utf-8");
console.log("File content:", readContent);

// Append data synchronously
fs.appendFileSync(syncFilePath, "\nData appended");
console.log("Data appended successfully");

// ✅ Asynchronous File Operations using fs.promises

// Define path for async file
const asyncFilePath = path.join(dataFolder, "async-example.txt");

// Create an async IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    // Write to file asynchronously
    await fsPromises.writeFile(asyncFilePath, "Hello, Async Node.js");
    console.log("Async file created successfully");

    // Read the file content asynchronously
    const asyncData = await fsPromises.readFile(asyncFilePath, "utf8");
    console.log("Async file content:", asyncData);

    // Append new content
    await fsPromises.appendFile(asyncFilePath, "\nThis is another line added");
    console.log("New line appended to async file");

    // Read the updated content
    const updatedData = await fsPromises.readFile(asyncFilePath, "utf8");
    console.log("Updated file content:", updatedData);
  } catch (err) {
    console.error("Error during async file operations:", err);
  }
})();
