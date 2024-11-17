const express = require('express')
const mysql = require('mysql')
const cors = require('cors') 
const app = express()
const expressPort = 3000

app.use(cors())
app.use(express.json())

const dataBase = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'root',
    database: 'users_db'
})

dataBase.connect((err) => {
    if (err) {
        console.log("Erreur de connexion:", err)
        return
    }
    console.log("Connexion à la base de données réussie")
})

app.get('/items', (req, res) => {
    const sql = 'SELECT * FROM produits;'
    dataBase.query(sql, (err, results) => {
        if (err) {
            console.log("Erreur SQL :", err); 
            return res.status(500).json({ 
                error: 'Erreur du serveur',
                details: err.message  
            })
        }
        return res.status(200).json(results)
    })
})

app.post('/produits', (req, res) => {
    console.log(req.body);  
    const { nom, prix, description } = req.body;  
    const sql = "INSERT INTO produits (nom, prix, description) VALUES (?, ?, ?)"; 
    dataBase.query(sql, [nom, prix, description], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur du serveur' });
        }
        return res.status(201).json(results);
    });
});

app.put('/update', (req, res) => {
    const { nom, prix, description, id } = req.body;  
    console.log("req.body", req.body)
    const sql = "UPDATE produits SET nom = ?, prix = ?, description = ? WHERE id = ?";  
    dataBase.query(sql, [nom, prix, description, id], (err, results) => {
        if (err) {
            console.log(err.message)
            return res.status(500).json({ error: 'Erreur du serveur' })
        }
        return res.status(200).json(results)
    })
})

app.delete('/delete', (req, res) => {
    const { id } = req.body
    const sql = "DELETE FROM produits WHERE id = ?"
    dataBase.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur du serveur' })
        }
        return res.status(200).json(results)
    })
})

app.listen(expressPort, () => {
    console.log('Serveur en cours exécution sur le port:', expressPort)
})
