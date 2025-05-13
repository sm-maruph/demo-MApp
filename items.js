const mysql = require('mysql2/promise');

// Configure your InfinityFree MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'sql305.infinityfree.com',
  user: process.env.DB_USER || 'if0_38973271',
  password: process.env.DB_PASS || 'LjwHw202KN',
  database: process.env.DB_NAME || 'if0_38973271_ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [req.query.id]);
          return res.status(200).json(rows[0] || {});
        } else {
          const [rows] = await pool.query('SELECT * FROM items');
          return res.status(200).json(rows);
        }

      case 'POST':
        const { name, description } = req.body;
        const [result] = await pool.query(
          'INSERT INTO items (name, description) VALUES (?, ?)',
          [name, description]
        );
        return res.status(201).json({ id: result.insertId });

      case 'PUT':
        const { id, name: updateName, description: updateDesc } = req.body;
        await pool.query(
          'UPDATE items SET name = ?, description = ? WHERE id = ?',
          [updateName, updateDesc, id]
        );
        return res.status(200).json({ success: true });

      case 'DELETE':
        await pool.query('DELETE FROM items WHERE id = ?', [req.query.id]);
        return res.status(200).json({ success: true });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database operation failed' });
  }
};
