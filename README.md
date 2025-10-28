# Real-Time E-commerce Cart

This is a real-time e-commerce cart application built with React, Redux, and Firebase. The project demonstrates a robust, scalable architecture for handling user-specific data with real-time updates.

## Deployed App
[https://busybuy-e-commerce.netlify.app/](https://busybuy-e-commerce.netlify.app/)

## Key Features

* **User Authentication**: Secure anonymous authentication using Firebase to manage unique user sessions.

* **Real-Time Data**: Utilizes Firestore's `onSnapshot` listener to provide instant, real-time updates to the user's cart and order history.

* **State Management**: Leverages Redux for predictable and centralized application state management.

* **Async Operations**: Employs Redux Thunk for handling asynchronous operations, such as adding, removing, or purchasing products.

* **Firestore Integration**: The database is structured to handle user-specific data, including a cart and an order history, using the recommended subcollection data model for scalability.

* **Secure Data Handling**: Implements Firebase Security Rules to ensure that users can only access their own data.

## Technologies Used

* **React**: A JavaScript library for building user interfaces.

* **Redux**: A predictable state container for JavaScript applications.

* **Redux Toolkit**: The official, opinionated, batteries-included toolset for efficient Redux development.

* **Firebase**: A Google platform for building web and mobile applications.
    * **Firestore**: A flexible, scalable NoSQL cloud database.
    * **Firebase Authentication**: Provides secure user authentication services.

* **HTML & CSS Modules**: For structuring the application's components and styling.

## Installation and Setup

To run this project locally, follow these steps:

1.  **Clone the repository**:

    ```bash
    git clone [your-repository-url]
    cd [your-project-folder]
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Firebase**:

    * Go to the [Firebase Console](https://console.firebase.com/).
    * Create a new project.
    * Set up **Firestore** and enable **anonymous authentication** in Firebase Auth.
    * Copy your Firebase configuration object and paste it into a file (e.g., `src/config/firebase.js`).

4.  **Add your Firebase Security Rules**:

    * In the Firebase Console, go to **Firestore > Rules**.
    * Add the following rules to ensure users can only access their own data. This is a crucial step for security.

    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Allows authenticated users to read and write to their own cart and orders
        match /usersCarts/{userId} {
          allow read, write: if request.auth.uid == userId;
        }

        match /userOrders/{userId} {
          allow read: if request.auth.uid == userId;
        }
      }
    }
    ```

5.  **Run the application**:

    ```bash
    npm start
    # or
    yarn start
    ```

The application should now be running on `http://localhost:3000`.

## Project Structure

* `src/`: Contains all the application code.
* `src/components/`: Reusable React components like `OrderTable`.
* `src/redux/`: Redux-related files, including slices, actions, and the store.
* `src/config/firebase.js`: Firebase initialization and configuration.
* `src/pages/`: The pages of the application like `loginPage`, `registerPage`, etc.
* `src/App.js`: The main application component.

## Acknowledgements

* **Google Firebase**: For the powerful and easy-to-use backend services.
* **Redux & Redux Toolkit**: For simplifying state management in the application.
