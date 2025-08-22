#!/bin/bash
set -e

NAMESPACE=default   # change if using custom namespace
SECRET_NAME=chatsphere-secrets

echo "🚀 Starting Kubernetes deployment in namespace: $NAMESPACE"

# 1. Apply ConfigMap
echo "📦 Applying ConfigMap..."
kubectl apply -f k8s/configmap.yaml -n $NAMESPACE

# 2. Create/Update Secret from .env
if [ ! -f .env ]; then
  echo "❌ .env file not found! Please create one with your secrets."
  exit 1
fi

echo "🔑 Creating/Updating Kubernetes Secret from .env..."
kubectl delete secret $SECRET_NAME -n $NAMESPACE --ignore-not-found
kubectl create secret generic $SECRET_NAME -n $NAMESPACE --from-env-file=.deploy.env

# 3. Apply Deployment & Service
echo "⚙️ Applying Deployment and Service..."
kubectl apply -f k8s/deployment.yaml -n $NAMESPACE
kubectl apply -f k8s/service.yaml -n $NAMESPACE

# 4. Apply Ingress if exists
if [ -f k8s/ingress.yaml ]; then
  echo "🌍 Applying Ingress..."
  kubectl apply -f k8s/ingress.yaml -n $NAMESPACE
fi

# 5. Wait for pods
echo "⏳ Waiting for pods to become ready..."
kubectl rollout status deployment/chatsphere-api -n $NAMESPACE

# 6. Show resources
echo "✅ Deployment finished. Current resources:"
kubectl get all -n $NAMESPACE
