# Deployment Guide for Marina WTBM Quiz App

This guide walks you through deploying the Marina WTBM Quiz App to Google Cloud Run with Firebase for persistent storage.

## Prerequisites

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and configured
2. [Firebase project](https://console.firebase.google.com/) created
3. Git and Node.js installed locally

## Setup Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Set up Firestore Database (make sure to start in production mode)
4. Get your Firebase configuration:
   - Go to Project Settings
   - Scroll down to "Your apps" section
   - Select the Web app or create a new one
   - Copy the Firebase config variables

## Environment Setup

1. Create a `.env.production.local` file with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

2. Update the `deploy-cloud-run.sh` script with your Google Cloud project ID:

```bash
PROJECT_ID="your-gcp-project-id"
SERVICE_NAME="marina-wtbm"
REGION="us-central1"  # Change if needed
```

## Deploy to Google Cloud Run

1. Make sure the deployment script is executable:

```bash
chmod +x deploy-cloud-run.sh
```

2. Run the deployment script:

```bash
./deploy-cloud-run.sh
```

3. The script will:
   - Build a Docker container with your app
   - Push it to Google Container Registry
   - Deploy it to Cloud Run
   - Print the URL where your application is running

## Firestore Security Rules

For production, consider setting up proper [security rules](https://firebase.google.com/docs/firestore/security/get-started) for your Firestore database. Here are some basic rules to start with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to quiz results
    match /quizResults/{document=**} {
      allow read: if true;
      allow write: if true; // Consider restricting this in production
    }
    
    // Allow public read access to questions
    match /quizQuestions/{document=**} {
      allow read: if true;
      // Only allow writes from admin users
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Troubleshooting

- If you encounter errors during deployment, check the Google Cloud Console logs
- For Firestore connectivity issues, verify your Firebase configuration and permissions
- If the app is running but data isn't persisting, check the Firebase Console for Firestore activity

## Maintenance

To update your application:

1. Make changes to your code
2. Run the deployment script again
3. The new version will be deployed automatically 