#!/bin/zsh
set -e

# Configuration
PROJECT_ID="hwtbam-14-414018"
SERVICE_NAME="marina-wtbm"
REGION="us-central1"

# Load environment variables from .env.production.local
if [ -f .env.production.local ]; then
  # Use zsh-compatible way to export variables
  while IFS='=' read -r key value; do
    # Skip comments and empty lines
    if [[ ! $key =~ ^#.* ]] && [[ -n $key ]]; then
      # Remove any leading/trailing whitespace and quotes
      key=$(echo $key | xargs)
      value=$(echo $value | xargs)
      export "$key=$value"
    fi
  done < .env.production.local
else
  echo "Error: .env.production.local file not found. Create it first with your Firebase configuration."
  exit 1
fi

# First build the Next.js app
echo "Building Next.js application..."
npm run build

# Build and deploy using Cloud Build with cloudbuild.yaml
echo "Building and deploying with Cloud Build..."
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_NEXT_PUBLIC_FIREBASE_API_KEY="$NEXT_PUBLIC_FIREBASE_API_KEY",\
_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",\
_NEXT_PUBLIC_FIREBASE_DATABASE_URL="$NEXT_PUBLIC_FIREBASE_DATABASE_URL",\
_NEXT_PUBLIC_FIREBASE_PROJECT_ID="$NEXT_PUBLIC_FIREBASE_PROJECT_ID",\
_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",\
_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",\
_NEXT_PUBLIC_FIREBASE_APP_ID="$NEXT_PUBLIC_FIREBASE_APP_ID",\
_NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",\
_SERVICE_NAME="$SERVICE_NAME",\
_REGION="$REGION"

echo "Deployment complete!"
echo "Your application should be available at: $(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')" 