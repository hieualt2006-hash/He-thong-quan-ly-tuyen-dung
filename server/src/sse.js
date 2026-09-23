/**
 * Real-time Server-Sent Events (SSE) Hub
 * Manages active SSE client connections and broadcasts events.
 */

const clients = new Set();

/**
 * Register an active SSE client response stream
 * @param {import('express').Response} res
 */
function addClient(res) {
  clients.add(res);
  console.log(`📡 [SSE CONNECT] Client connected. Active SSE clients: ${clients.size}`);
}

/**
 * Remove an SSE client response stream
 * @param {import('express').Response} res
 */
function removeClient(res) {
  clients.delete(res);
  console.log(`📡 [SSE DISCONNECT] Client disconnected. Active SSE clients: ${clients.size}`);
}

/**
 * Broadcast an event with data to all connected clients
 * @param {string} event - Event name (e.g. 'JobCreated', 'JobUpdated', 'JobDeleted', 'NewApplicationReceived')
 * @param {any} data - Serializable payload
 */
function broadcast(event, data) {
  console.log(`📡 [SSE BROADCAST] Event "${event}" to ${clients.size} clients:`, JSON.stringify(data));
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    try {
      client.write(payload);
    } catch (err) {
      console.warn('Error writing SSE message to client, removing:', err.message);
      clients.delete(client);
    }
  }
}

/**
 * Returns current count of connected SSE clients
 */
function clientCount() {
  return clients.size;
}

module.exports = {
  addClient,
  removeClient,
  broadcast,
  clientCount
};
