// Import required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

// Vacation data with images
let vacationSpots = [
    { name: "Hawaii", cost: 1500, rating: 4.8, image: "/images/hawaii.jpg", url: "https://www.gohawaii.com/" },
    { name: "Bali", cost: 800, rating: 4.5, image: "/images/bali.jpg", url: "https://www.indonesia.travel/gb/en/destinations/bali-nusa-tenggara/bali" },
    { name: "Paris", cost: 2000, rating: 4.7, image: "/images/paris.jpg", url: "https://en.parisinfo.com/" },
    { name: "Thailand", cost: 600, rating: 4.3, image: "/images/thailand.jpg", url: "https://www.tourismthailand.org/" },
    { name: "Greece", cost: 1200, rating: 4.6, image: "/images/greece.jpg", url: "https://visitgreece.gr/" },
    { name: "Italy", cost: 1700, rating: 4.7, image: "/images/italy.jpg", url: "https://www.italia.it/en/home.html" },
    { name: "Japan", cost: 2200, rating: 4.9, image: "/images/japan.jpg", url: "https://www.japan.travel/en/" },
    { name: "Dubai", cost: 2500, rating: 4.8, image: "/images/dubai.jpg", url: "https://www.visitdubai.com/en" },
    { name: "Egypt", cost: 900, rating: 4.5, image: "/images/egypt.jpg", url: "https://egypt.travel/" },
    { name: "Switzerland", cost: 3000, rating: 4.9, image: "/images/switzerland.jpg", url: "https://www.myswitzerland.com/en/" },
    { name: "Maldives", cost: 1500, rating: 4.6, image: "/images/maldives.jpg", url: "https://visitmaldives.com/en" },
    { name: "Brazil", cost: 1000, rating: 4.4, image: "/images/brazil.jpg", url: "https://www.visitbrasil.com/" },
];

// Serve static files from "public" folder
app.use(express.static('public'));
app.use(express.json());

// API endpoint to filter vacations based on budget
app.get('/api/vacations', (req, res) => {
    const budget = parseInt(req.query.budget);
    const filteredSpots = vacationSpots
        .filter(spot => spot.cost <= budget)
        .sort((a, b) => b.rating - a.rating);
    res.json(filteredSpots);
});

// Update vacation ratings every 5 seconds
setInterval(() => {
    vacationSpots = vacationSpots.map(spot => ({
        ...spot,
        rating: parseFloat((spot.rating + (Math.random() - 0.5) * 0.1).toFixed(2))
    }));
    io.emit('updateRatings', vacationSpots);
}, 5000);

// Start the server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
