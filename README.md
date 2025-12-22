# BusyBuy 🛒
BusyBuy is a feature-rich e-commerce platform built with **React**, **Redux Toolkit**, and **Firebase**. It provides a seamless shopping experience with real-time data synchronization, secure authentication, and a dynamic ordering system.

## Introduction
BusyBuy is designed to handle the complexities of a modern online store. By leveraging **Firebase** for backend services and **Redux Toolkit** for centralized state management, the app ensures that user carts and order histories are persistent, secure, and updated in real-time. Whether filtering through products or managing a shopping cart, users experience a fast and responsive interface.

## Deployed App
[busybuy-e-commerce.netlify.app](busybuy-e-commerce.netlify.app/)

## Features

### 1. Secure Authentication
* Integrated **Firebase Authentication** for secure Sign-Up and Login.
* Protects user data, ensuring that carts and order histories are private to each individual user.

### 2. Product Discovery & Filtering
* Interactive home page featuring a wide array of products.
* **Search & Filter:** Users can quickly find products by name or narrow down their search using category and price range filters.

### 3. Real-time Shopping Cart
* Powered by **Redux Toolkit** for smooth, lag-free state updates.
* Users can add items, adjust quantities, or remove products directly from the cart view.

### 4. Instant Order Processing
* Once a purchase is confirmed, items move from the Cart to the Order History.
* **Real-time Sync:** Uses **Firestore Real-time Listeners** to update the UI instantly when an order is placed, eliminating the need for page refreshes.

### 5. Order History Tracking
* A dedicated dashboard for users to view their transaction history, organized by date and order details.

## Technology Stack
* **Frontend:** React.js
* **State Management:** Redux Toolkit
* **Backend/Database:** Firebase Firestore
* **Authentication:** Firebase Auth
* **Styling:** CSS Modules / Material-UI (adjust if needed)

## Installation & Getting Started
Detailed instructions on how to install, configure, and get the project running.

```bash
# Clone the repository
git clone https://github.com/sumant236/BusyBuy_React-Redux.git

# Navigate into the project directory
cd BusyBuy_React-Redux

# Install dependencies
npm install 

# Start the development server
npm start
```

## Usage

1. **User Authentication**
   Sign up or log in to create your personalized shopping session. Using Firebase Authentication, your cart and order data remain private and secure.
   <img width="1903" height="915" alt="Sign In" src="https://github.com/user-attachments/assets/f895ff64-239f-4a5e-9845-1b7ccd7ac2c8" />


2. **Browsing & Filtering**
   Explore products on the homepage and use the sidebar filters to find exactly what you need. You can filter by category and price range dynamically.
   <img width="1920" height="1080" alt="Filter 1" src="https://github.com/user-attachments/assets/834340f5-c18f-416c-ac80-fe7b9e2fc9a0" />

   <img width="1906" height="910" alt="Filter 2" src="https://github.com/user-attachments/assets/7e887691-f131-4345-816d-bd8f84d6c3d0" />

3. **Managing the Cart**
   Add items to your cart from the homepage. In the cart view, you can adjust quantities or remove items, with the total price updating in real-time.
   <img width="1920" height="1080" alt="Cart Page" src="https://github.com/user-attachments/assets/df627cfa-a699-4bf1-8ce5-ecd6f74ea9a3" />


4. **Order History**
   After purchasing, view your full order history. Thanks to Firestore real-time listeners, your new transactions appear instantly without a page refresh.
   <img width="1920" height="1080" alt="Final order" src="https://github.com/user-attachments/assets/359b827e-d5ef-48ef-bc5e-17c7f0251203" />
