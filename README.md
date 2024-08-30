# Chizmiz

## Overview

**Chizmiz** is a social media platform built with React and Firebase. It allows users to create posts, like and comment on posts, and manage user authentication for secure access to the platform.

## Features

- **Create Posts**: Users can create new posts with text and images.
- **Like and Comment**: Engage with posts by liking them or adding comments.
- **Delete Posts**: Users can delete their own posts.
- **Authentication**: Secure user authentication to restrict access to certain features.

## Technologies Used

- **React**: For building the user interface.
- **Firebase**: For backend services, including Firestore for the database and Firebase Authentication for user management.
- **Chakra UI**: For UI components and styling.
- **SweetAlert2**: For user-friendly alerts and notifications.
- **React Router**: For client-side routing and navigation.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **npm**: Comes with Node.js.

### Installation

1. **Clone the repository**:

   git clone https://github.com/yourusername/chizmiz

2. **Navigate to the project directory:**:

    cd chizmiz

3. **Install the dependencies:**:

    npm install

#### Firebase Setup

1.Go to the Firebase Console.

2.Create a new Firebase project.

3.Add a web app to your Firebase project.

4.Copy the Firebase config object.

5.Create a firebaseConfig.js file in the src/pages directory and add your Firebase config object:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

export default firebaseConfig;

6.Set up the Firestore database in the Firebase console and create a collection named chizmizs.

##### Running the Application

1. Start the development server:

    npm run dev

###### Usage

* Create Post: Navigate to the post creation section and fill out the form to create a new post.
* Like and Comment: Click on the like button to like a post, or enter a comment in the comment field and submit it.
* Delete Post: Use the delete button on your posts to remove them.
* User Authentication: Register or log in to access all features.

###### Project Structure

* src/: Contains all the source code.
* components/: Contains React components.
* pages/: Contains page components like registration and login.
* firebaseConfig.js: Firebase configuration file.
* App.js: Main app component.
* index.js: Entry point of the application.


###### Contributing 
If you want to contribute to this project, please fork the repository and submit a pull request.

###### License 
This project is licensed under the MIT License 

##### Contact
If you have any question or feedback, please reach out to me at mhigenieva@gmail.com




