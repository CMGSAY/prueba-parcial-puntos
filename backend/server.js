require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Supabase Client Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

// Verificación de seguridad para los logs de Render
if (!supabaseUrl || !supabaseKey) {
    console.error("🚨 ERROR CRÍTICO: Faltan variables de entorno.");
    console.error(`SUPABASE_URL detectado: ${supabaseUrl ? 'SÍ' : 'NO'}`);
    console.error(`SUPABASE_PUBLISHABLE_KEY detectado: ${supabaseKey ? 'SÍ' : 'NO'}`);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- ENDPOINTS ---

// 1. GET /api/users
// Retorna la lista de usuarios ordenados por puntos (de mayor a menor)
app.get('/api/users', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('points', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

// 2. POST /api/users/register
// Crea un nuevo usuario
app.post('/api/users/register', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, points: 0 }])
            .select();

        if (error) {
            // Manejar error de email duplicado
            if (error.code === '23505') {
                return res.status(409).json({ error: 'Email already exists' });
            }
            throw error;
        }

        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: error.message });
    }
});

// 3. POST /api/users/add-points
// Suma puntos a un usuario existente por su ID
app.post('/api/users/add-points', async (req, res) => {
    try {
        const { userId, points } = req.body;

        if (!userId || typeof points !== 'number') {
            return res.status(400).json({ error: 'Valid userId and points are required' });
        }

        // Obtener puntos actuales
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('points')
            .eq('id', userId)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return res.status(404).json({ error: 'User not found' });
            }
            throw fetchError;
        }

        const newPoints = user.points + points;

        // Actualizar puntos
        const { data, error: updateError } = await supabase
            .from('users')
            .update({ points: newPoints })
            .eq('id', userId)
            .select();

        if (updateError) throw updateError;

        res.status(200).json(data[0]);
    } catch (error) {
        console.error('Error adding points:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});