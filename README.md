# I-Artist

This is a post application built with React, Firebase, and Firestore. It allows users to upload images with captions, like and comment on posts, and view other users' profiles.

## Features

- **User Authentication:** Sign up and log in using Firebase authentication.
- **Create Posts:** Upload images with captions.
- **Like Posts:** Users can like posts, with real-time updates on like counts.
- **Comment on Posts:** Add comments to posts and view comments in a modal.
- **Edit and Delete Posts:** Post owners can edit and delete their own posts.
- **Profile Viewing:** View other users' profiles by clicking the 'View Profile' button in the post menu.
- **Comment Management:** Users can edit and delete their own comments.

## Tech Stack

- **React:** Frontend framework for building the user interface.
- **Firebase Auth:** For user authentication.
- **Firestore:** For storing posts, comments, and user data.
- **Firebase Storage:** For storing uploaded images.
- **React Router:** For navigation between different pages.

## Setup and Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/schrodinger41/iArtist
   cd iArtist

2. **Install dependencies:**
   ```bash
   npm install
   
3. **Firebase Setup:**
- Create a Firebase project at Firebase Console.
- Add a new web app to your Firebase project.
- Copy your Firebase configuration and replace the placeholders in the firebase.js file located in the config directory.

4. **Environment Variables:**
  Create a firebase.js file in your project and add your Firebase configuration: 
    ```bash
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id

5. **Run the application:**
   ```bash
   npm run dev

## Contributing
**If you wish to contribute to this project, feel free to fork the repository and submit a pull request.**

## Contact
**For any inquiries or support, feel free to reach out:**
- Email: jhetdizon41@gmail.com
- LinkedIn: Jhet Andrei Dizon


  



