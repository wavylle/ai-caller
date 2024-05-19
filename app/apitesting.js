import axios from "axios"

// Shopify store credentials
const shopifyStore = 'productassist';
const apiKey = 'f4d6b8ad1cdc40ba5ad2f445ad6594f0';
const apiPassword = 'b293e1de251a51bd4a04af1d704b9ff7';

// Function to fetch all orders
async function getAllOrders() {
    try {
        // Shopify API endpoint to get orders
        const endpoint = `https://${shopifyStore}.myshopify.com/admin/api/2022-01/orders.json`;

        // Make a GET request to Shopify API to fetch all orders
        const response = await axios.get(endpoint, {
            auth: {
                username: apiKey,
                password: apiPassword
            },
            params: {
                status: 'any' // Fetch all orders, including closed and canceled ones
            }
        });

        // Extract orders from the response
        const orders = response.data.orders;

        // Log or process the orders as needed
        console.log('All orders:', orders);
    } catch (error) {
        console.error('Error fetching orders:', error.response ? error.response.data : error.message);
    }
}

// Call the function to fetch all orders
getAllOrders();
