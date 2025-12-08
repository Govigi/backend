import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const reverseGeocode = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ message: "Latitude and Longitude are required" });
        }

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error("Reverse Geocode Error:", error.message);
        res.status(500).json({ message: "Failed to fetch address" });
    }
};

export const geocodeAddress = async (req, res) => {
    try {
        const { address } = req.query;
        if (!address) {
            return res.status(400).json({ message: "Address is required" });
        }

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error("Geocode Error:", error.message);
        res.status(500).json({ message: "Failed to fetch coordinates" });
    }
};

export const autocomplete = async (req, res) => {
    try {
        const { input } = req.query;
        if (!input) {
            return res.status(400).json({ message: "Input is required" });
        }

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_MAPS_API_KEY}&components=country:in`
        );
        res.json(response.data);
    } catch (error) {
        console.error("Autocomplete Error:", error.message);
        res.status(500).json({ message: "Failed to fetch suggestions" });
    }
};

export const placeDetails = async (req, res) => {
    try {
        const { place_id } = req.query;
        if (!place_id) {
            return res.status(400).json({ message: "Place ID is required" });
        }

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${GOOGLE_MAPS_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error("Place Details Error:", error.message);
        res.status(500).json({ message: "Failed to fetch place details" });
    }
};
