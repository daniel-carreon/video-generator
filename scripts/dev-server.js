#!/usr/bin/env node

/**
 * Auto Port Detection for Next.js Development Server
 * Checks ports 3000-3006 and uses the first available one
 * Handles both IPv4 (0.0.0.0) and IPv6 (::)
 */

const { spawn } = require('child_process');
const net = require('net');

const PORT_RANGE = [3000, 3001, 3002, 3003, 3004, 3005, 3006];

/**
 * Check if a port is available
 * @param {number} port - Port to check
 * @returns {Promise<boolean>} - True if port is available
 */
async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(false);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(true);
    });

    server.listen(port, '0.0.0.0');
  });
}

/**
 * Find first available port in range
 * @returns {Promise<number|null>} - Available port or null
 */
async function findAvailablePort() {
  for (const port of PORT_RANGE) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
  }
  return null;
}

/**
 * Start Next.js development server on available port
 */
async function startDevServer() {
  console.log('🔍 Checking for available port...');

  const port = await findAvailablePort();

  if (!port) {
    console.error('❌ No available ports found in range 3000-3006');
    console.error('💡 Please free up some ports and try again');
    process.exit(1);
  }

  console.log(`✅ Found available port: ${port}`);
  console.log(`🚀 Starting Next.js on http://localhost:${port}\n`);

  const child = spawn(
    'npx',
    ['next', 'dev', '--hostname', '0.0.0.0', '--port', port.toString()],
    {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, PORT: port.toString() }
    }
  );

  // Handle graceful shutdown
  const cleanup = () => {
    console.log('\n👋 Shutting down development server...');
    child.kill('SIGTERM');
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  child.on('error', (err) => {
    console.error('❌ Failed to start development server:', err);
    process.exit(1);
  });

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`❌ Development server exited with code ${code}`);
      process.exit(code);
    }
  });
}

// Start the server
startDevServer().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
