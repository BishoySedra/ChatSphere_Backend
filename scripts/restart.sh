#!/bin/bash
set -e

echo "🔄 Restarting Chatsphere Kubernetes deployment..."

# Step 1: Cleanup old resources
./cleanup.sh

# Step 2: Deploy fresh resources
./deploy.sh

echo "✅ Restart complete!"
