#!/bin/bash
set -e

# Configuration
PROJECT_ID="your-gcp-project-id"
SERVICE_NAME="marina-wtbm"
REGION="us-central1"

# Load environment variables from .env.production.local
if [ -f .env.production.local ]; then
  export $(cat .env.production.local | grep -v '^#' | xargs)
else
  echo "Error: .env.production.local file not found. Create it first with your Firebase configuration."
  exit 1
fi

# Build and push the container image
echo "Building and pushing the container image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 1Gi

echo "Deployment complete!"
echo "Your application should be available at: $(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')" 