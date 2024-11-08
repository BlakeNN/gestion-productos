const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const { send } = require("process");
require("dotenv").config();

const conn = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

conn.connect((err) => {
    if(err) throw err;
    console.log("Conexion Exitosa a la BD")
})

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

async function mostrarCategorias(conn, res, pag) {
    try {
        const mostrarCats = 'SELECT * FROM categorias'
         conn.query(mostrarCats, (err, resMostrar) => {
            if (err) {
                throw err;
            } else {
                res.render(pag, { cats: resMostrar });
            }
        });
        return res;
    } catch (error) {
        throw error;
    }
}

async function mostrarProductos(conn, req, res, pag, cat) {
    try {
        const mostrarProds = 'SELECT * FROM productos WHERE idCat = ?';
        conn.query(mostrarProds, [cat], (err, resMostrar) => {
            if (err) {
                throw err;
            } else {
                res.render(pag, { prods: resMostrar, cat: cat, admin: req.session.rol });
            }
        });
    } catch (error) {
        throw error;
    }
}

app.get('/', (req, res) => {
    res.render("inicio");
});

app.post('/validar', (req, res) => {
    const logIn = 'SELECT * FROM users WHERE name = ? AND pass = ?;';
    const { user, pass } = req.body;

    conn.query(logIn, [user, pass], (err, resLogin) => {
        if (err) {
            // Manejo de error en la consulta, opcional
            return res.status(500).send("Error en el servidor");
        }

        if (resLogin.length === 0) {
            // Caso de credenciales incorrectas
            return res.send("Usuario y/o Contraseña Incorrectos"); // `return` detiene la ejecución
        } else {
            // Caso de credenciales correctas
            req.session.idUser = resLogin[0].idUser;
            req.session.user = resLogin[0].name;
            req.session.pass = resLogin[0].pass;
            req.session.rol = resLogin[0].admin;

            let admin = req.session.rol;
            if (admin) {
                res.redirect("admin");
            } else {
                res.redirect("user");
            }
        }
    });
});

app.get('/admin', async (req, res) => {
    if (req.session.rol) {
        mostrarCategorias(conn, res, 'admin');
    } else {
        res.send("Credenciales Invalidas")
    }
});

app.get('/user', (req, res) => {
    let data = 0;
    res.render('user', { mostrarData: data })
});

app.get('/verCats', (req, res) => {
    mostrarCategorias(conn, res, 'verCats');
});

app.get('/buscProd', (req, res) => {
    const srch = req.query.srch;
    const mostrarProd = 'SELECT * FROM productos WHERE cod = ?';
    conn.query(mostrarProd, [srch], (err, resMostrar) => {
        if (err) {
            throw err;
        } else {
            data = 1;
            res.render('user', { mostrarData: data, prodData: resMostrar});
        }
    });
});

app.get('/addUser', (req, res) => {
    res.render("addUser"); 
});
app.get('/delUser', (req, res) => {
    const getUsers = 'SELECT * FROM users';
    conn.query(getUsers, (err, resUsers) => {
        if (err) {
            throw err;
        } else {
            res.render('delUser', { users: resUsers });
        }
    });
});

app.get('/delete', (req, res) => {
    const deleteUser = 'DELETE FROM users WHERE idUser = ?';
    let nroUser = req.query.user;
    conn.query(deleteUser, [nroUser], (err, resDelete) => {
        if(err) {
            throw err;
        } else {
            res.redirect("delUser");
        }
    });
});

app.post('/crearUser', (req, res) => {
    const crearUsuario = 'INSERT INTO users (name, pass, admin) VALUES (?, ?, ?)';
    let {user, pass, isAdmin} = req.body;
    if(isAdmin === 'admin') {
        isAdmin = 1;
    } else {
        isAdmin = 0;
    }
    conn.query(crearUsuario, [user, pass, isAdmin], (err, resCreate) => {
        if(err) {
            console.log(err)
        } else {
            res.redirect('admin');
        }
    });
});

app.get('/addcat', (req, res) => {
    res.render("addCat")
});

app.post('/crearCat', (req, res) => {
    const buscarDuplicados = 'SELECT EXISTS (SELECT 1 FROM categorias WHERE cat = ?) AS existe';
    const createCat = 'INSERT INTO categorias (cat) VALUES (?)'
    const {cat} = req.body;
    conn.query(buscarDuplicados, [cat], (err, resDupl) => {
        let dupl = resDupl[0].existe;
        if (dupl > 0) {
            res.send("Esta categoria ya existe")
        } else {
            conn.query(createCat, [cat], (err, resCreate) => {
                if(err) {
                    console.log(err)
                } else {
                    res.redirect('admin');
                }
            });
        }
    })
});

app.get('/delCat', (req, res) => {
    mostrarCategorias(conn, res, 'delCat');
});

app.get('/deleteCat', (req, res) => {
    const deletCat = 'DELETE FROM categorias WHERE idCat = ?';
    let nroCat = req.query.categ;
    conn.query(deletCat, [nroCat], (err, resDel) => {
        if(err) {
            throw err;
        } else {
            res.redirect('delCat');
        }
    });
});
app.get('/addProd', (req, res) => {
    const {cat} = req.query;
    res.render('addProd', {cat: cat});
})
app.post('/prodAdded', (req, res) => {
    const checkCat = 'SELECT * FROM categorias WHERE idCat = ?'
    const añadirProd = 'INSERT INTO productos (cod, prod, idCat, precio) VALUES (?, ?, ?, ?)';
    const {cat} = req.query;
    const {cod, prod, precio} = req.body;
    conn.query(checkCat, [cat], (err, resCheck) => {
        if (resCheck.length > 0) {
            conn.query(añadirProd, [cod, prod, cat, precio], (err, resAdd) => {
                if(err) {
                    throw err;
                } else {
                    res.redirect(`verProds?cat=${cat}`);        
                }
            });
        } else {
            res.send("La categoria ya no existe")
        }
    })
});

app.get('/verProds', (req, res) => {
    const {cat} = req.query;
    mostrarProductos(conn, req, res, 'verProds', cat);
});

app.get('/updtprcs', (req, res) => {
    const {cat} = req.query;
    mostrarProductos(conn, req, res, 'updtPrcs', cat);
});
app.post('/updated', (req, res) => {
    const { productos, aumento } = req.body;
    const porcentajeAumento = parseFloat(aumento);

    if (!productos || productos.length === 0 || isNaN(porcentajeAumento)) {
        return res.status(400).json({ success: false, message: 'Datos inválidos' });
    }

    // Construir la consulta SQL para actualizar los precios
    const codigos = productos.map(cod => conn.escape(cod)).join(','); // Escapamos los códigos para evitar inyecciones SQL
    const query = `UPDATE productos SET precio = precio * (1 + ? / 100) WHERE cod IN (${codigos})`;

    // Ejecutar la consulta
    conn.query(query, [porcentajeAumento], (error, results) => {
        if (error) {
            console.error('Error al actualizar precios:', error);
            return res.status(500).json({ success: false, message: 'Error al actualizar precios' });
        }

        res.json({ success: true, message: 'Aumento aplicado correctamente' });
    });
});

app.get('/deleteProd', (req, res) => {
    const deleteProds = 'DELETE FROM productos WHERE idProd = ?';
    const {prod, cat}= req.query;
    conn.query(deleteProds, [prod], (err, resDelete) => {
        if(err) {
            throw err;
        } else {
            res.redirect(`verProds?cat=${cat}`);
        }
    });
});

app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Escuchando Puerto: ${PORT} \nhttp://localhost:3000`)
})