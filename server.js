require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const errorHandler = require('./middleware/errorMiddleware')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api', authRoutes)
app.use('/api', productRoutes)
app.use('/api', cartRoutes)

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

// Error handling middleware
app.use(errorHandler)

// Connect Mongo and start server
mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected')
        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`)
        })
    })
    .catch(err => {
        console.error('MongoDB connection error:', err)
        process.exit(1)
    })
