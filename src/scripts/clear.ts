import { Glob } from "bun";
import { join } from "node:path";

/**
 * Targeted directories to be removed.
 * Using a Set for O(1) lookup performance.
 */
const TARGET_DIRECTORIES = new Set([
  "node_modules",
  ".turbo",
  "dist",
  "build",
  ".next",
  "out"
]);

async function runCleanup() {
  const rootDir = process.cwd();
  console.log(`🚀 Starting deep cleanup in: ${rootDir}`);
  
  const startTime = performance.now();
  let deletedCount = 0;

  /**
   * Scan for all items recursively.
   * dot: true ensures hidden directories like .turbo are detected.
   * onlyFiles: false ensures we see the directories themselves.
   */
  const scanner = new Glob("**/*");

  for (const matchedPath of scanner.scanSync({ 
    cwd: rootDir, 
    onlyFiles: false, 
    dot: true 
  })) {
    const pathParts = matchedPath.split("/");
    const folderName = pathParts[pathParts.length - 1];

    if (TARGET_DIRECTORIES.has(folderName!)) {
      const fullPath = join(rootDir, matchedPath);
      
      try {
        // Use system-level deletion for maximum speed on Ubuntu
        const process = Bun.spawn(["rm", "-rf", fullPath]);
        await process.exited;
        
        console.log(`🗑️  Deleted: ${matchedPath}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Failed to delete ${fullPath}:`, error);
      }
    }
  }

  const duration = (performance.now() - startTime).toFixed(2);
  console.log(`\n✨ Cleanup finished!`);
  console.log(`✅ Removed ${deletedCount} directories in ${duration}ms.`);
}

runCleanup().catch((err) => {
  console.error("Critical error during cleanup:", err);
  process.exit(1);
});