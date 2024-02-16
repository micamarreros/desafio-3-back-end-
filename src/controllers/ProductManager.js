const fs = require("fs").promises;

class ProductManager {
    static lastId = 0;
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(newObject) {
        let {title, description, price, thumbnail, code, stock} = newObject;
        // validacion para que todos los campos sean obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Completá todos los campos porfavor");
            return;
        }

        // validacion para que el codigo sea unico
        if (this.products.some(item=> item.code === code)) {
            console.log("El código ingresado ya existe");
            return;
        }

        // creo el objeto
        const newProduct = {
            id: ++ProductManager.lastId,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }

        // lo agrego al array
        this.products.push(newProduct);

        // guardar el array en el archivo
        await this.saveFile(this.products);
    } 

    //leer el archivo y devolver los productos en formato de arreglo
    async getProducts() {
        try {
            const productsArray = this.readFile();
            return productsArray;
        } catch (error) {
            console.log("Error al leer archivo", error);
        }
    }

    async getProductById(id) {
        try {
            const productsArray = await this.readFile();
            const searchProduct = productsArray.find(item => item.id === id);

            if (!searchProduct) {
                console.log("Producto no encontrado");
            } else {
                console.log("Producto encontrado");
                return searchProduct;
            }

        } catch (error) {
            console.log("Error al leer archivo", error);
        }
    }

    async readFile() {
        try {
            const response = await fs.readFile(this.path, "utf-8");
            const productsArray = JSON.parse(response);
            return productsArray;
        } catch (error) {
            console.log("Error al leer archivo", error);
        }
    }

    async saveFile(productsArray) {
        try {
            await fs.writeFile(this.path, JSON.stringify(productsArray, null, 2));
        } catch (error) {
            console.log("Error al guardar archivo", error);
        }
    }
    
    async getProductById(id) {
        try {
            const productsArray = await this.readFile();
            const searchProduct = productsArray.find(item => item.id === id);

            if (!searchProduct) {
                console.log("Producto no encontrado");
            } else {
                console.log("Producto encontrado");
                return searchProduct;
            }

        } catch (error) {
            console.log("Error al leer archivo", error);
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const productsArray = await this.readFile();
            
            const index = productsArray.findIndex(item => item.id === id);
    
            if(index !== -1) {
                productsArray.splice(index, 1, updatedProduct);
                await this.saveFile(productsArray);
            } else {
                console.log("No se encontró el producto");
            }
    
        } catch (error) {
            console.log("Error al actualizar producto", error);
        }
    }

    async deleteProduct(id) {

        try {
            const productsArray = await this.readFile();
            const newProductsArray = productsArray.filter(item => item.id !== id);
            await this.saveFile(newProductsArray);

        } catch (error) {
            console.log("Error al eliminar producto");
        }
    }
}

module.exports = ProductManager;

//Testing