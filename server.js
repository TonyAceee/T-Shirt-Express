'use strict';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const nodemailer = require('nodemailer');
const session = require('express-session');
const PORT = process.env.PORT || 1337;

const app = express();
const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
console.log(`Generated secret key: ${secretKey}`);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { title: 'Main Page' });
});

app.get('/api/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { subcategory, size, color, price, sort } = req.query;
        let filter = { category };

        if (subcategory && subcategory !== 'all') filter.subcategory = subcategory;
        if (color && color !== 'all') filter.color = color;
        if (price && price !== 'all') {
            const [minPrice, maxPrice] = price.split('-').map(Number);
            filter.price = { $gte: minPrice, $lte: maxPrice };
        }

        let products = await Product.find(filter);

        if (size && size !== 'all') {
            products = products.filter(product => product.sizes.includes(size));
        }

        if (sort === 'asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            products.sort((a, b) => b.price - a.price);
        }

        console.log('Filter:', filter);  
        console.log('Products:', products);  

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/category/:category', async (req, res) => {
    const category = req.params.category;
    const subcategory = req.query.subcategory || null;
    let filter = { category };

    if (subcategory) {
        filter.subcategory = subcategory;
    }

    try {
        const products = await Product.find(filter);

        res.render('category', { title: category, products, subcategory });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post('/cart/add', async (req, res) => {
    const { productId, size, quantity = 1 } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }

        const existingItemIndex = req.session.cart.findIndex(item => item.product._id.toString() === productId && item.size === size);

        if (existingItemIndex !== -1) {
            req.session.cart[existingItemIndex].quantity += parseInt(quantity, 10);
        } else {
            req.session.cart.push({
                product,
                size,
                quantity: parseInt(quantity, 10)
            });
        }

        res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Failed to add item to cart' });
    }
});

app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    res.render('cart', { cart, total });
});
app.post('/cart/remove', (req, res) => {
    const { productId, size, quantity } = req.body;

    if (req.session.cart) {
        let itemIndex = req.session.cart.findIndex(item => item.product._id.toString() === productId && item.size === size);

        if (itemIndex !== -1) {
            let item = req.session.cart[itemIndex];

            if (item.quantity > quantity) {
                
                item.quantity -= quantity;
            } else {
                
                req.session.cart.splice(itemIndex, 1);
            }
        }
    }

    res.redirect('/cart');
});



app.get('/admin/add-product', (req, res) => {
    res.render('add-product', { title: 'Add Product' });
});

app.post('/admin/add-product', async (req, res) => {
    try {
        const { name, category, subcategory, price, color, sizes, image_url, description } = req.body;

        
        let sizesArray = [];
        if (sizes) {
            sizesArray = sizes.split(',').map(size => size.trim());
        }

        const newProduct = new Product({
            name,
            category,
            subcategory, 
            price,
            color,
            sizes: sizesArray,
            image_url,
            description
        });

        await newProduct.save();
        res.redirect('/admin/add-product');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

function sendConfirmationEmail(email) {
    let transporter = nodemailer.createTransport({
        host: 'poczta.o2.pl',
        port: 465,
        secure: true,
        auth: {
            user: 'anton.eis@o2.pl',
            pass: '07052003a'
        }
    });

    let mailOptions = {
        from: 'anton.eis@o2.pl',
        to: email,
        subject: 'Confirmation Email',
        text: 'Thank you for registering.'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending confirmation email:', error);
        } else {
            console.log('Confirmation email sent:', info.response);
        }
    });
}

app.post('/register', (req, res) => {
    const { email, username, password } = req.body;

    User.findOne({ username })
        .then(existingUser => {
            if (existingUser) {
                res.status(409).send('User already exists.');
            } else {
                const newUser = new User({ email, username, password });

                newUser.save()
                    .then(() => {
                        sendConfirmationEmail(email);
                        res.status(200).send('User registered successfully.');
                    })
                    .catch(err => {
                        console.error('Error registering new user:', err);
                        res.status(500).send('Error registering new user.');
                    });
            }
        })
        .catch(err => {
            console.error('Error finding existing user:', err);
            res.status(500).send('Error registering new user.');
        });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username, password })
        .then(user => {
            if (!user) {
                res.status(401).send('Incorrect username or password.');
            } else {
               
                req.session.user = {
                    id: user._id,
                    username: user.username,
                    email: user.email
                };
                res.status(200).send('User logged in successfully.');
            }
        })
        .catch(err => {
            console.error('Error logging in:', err);
            res.status(500).send('Error logging in.');
        });
});
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});