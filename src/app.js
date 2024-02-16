const express = require("express");
const app = express();
const PORT = 8080;
const ProductManager = require("./controllers/ProductManager.js");

//crear instancia de ProductManager
const productManager = new ProductManager("./src/models/productos.json");

//middleware
app.use(express.json());

//rutas
// listar los productos del archivo json

app.get("/products",  async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if(limit) {
            res.json(products.slice(0, limit));
        } else {
           res.json(products)
        }
    } catch (error) {
        res.status(500).json({error:"Error interno del servidor"});
    }
})

// retornar producto por id
app.get("/products/:pid", async (req, res) => {
    try {
        let id = req.params.pid;
        const product = await productManager.getProductById(parseInt(id));

        if(!product) {
            return res.json({error: "ID no encontrado"});
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({error:"Error interno del servidor"});       
    }
})

//listen del servidor
app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
})