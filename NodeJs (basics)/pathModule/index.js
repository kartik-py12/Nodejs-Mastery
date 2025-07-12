// Importing the built-in 'path' module to work with file and directory paths
const path = require("path");

// Get the parent directory of the current directory
console.log("Directory name: ", path.dirname(__dirname));

// Get the base name (file name with extension) of the current file
console.log("File name: ", path.basename(__filename));

// Get the file extension of the current file
console.log("File extension: ", path.extname(__filename));

// Join multiple path segments into a single path (does not resolve to absolute)
const joinPath = path.join('/coding', 'Redemption', 'backendMastery');
console.log("Joined path: ", joinPath); // Output: /coding/Redemption/backendMastery

// Resolve a sequence of path segments into an absolute path from current working directory
const resolvePath = path.resolve('coding', 'pathModule');
console.log("Resolved path: ", resolvePath); // Depends on where you run the script

// Normalize a path string by resolving '..' and '.' segments and cleaning up slashes
const normalizePath = path.normalize('/coding/Redemption/../pathModule');
console.log("Normalized path: ", normalizePath); // Output: /coding/pathModule
