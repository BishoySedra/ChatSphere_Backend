#!/bin/bash
set -e

NAMESPACE=default   # change if you used another namespace

echo "🧹 Cleaning up Chatsphere resources from namespace: $NAMESPACE"

# Delete Deployment and Service
kubectl delete deployment chatsphere-api -n $NAMESPACE --ignore-not-found
kubectl delete service chatsphere-service -n $NAMESPACE --ignore-not-found

# Delete ConfigMap & Secret
kubectl delete configmap chatsphere-config -n $NAMESPACE --ignore-not-found
kubectl delete secret chatsphere-secrets -n $NAMESPACE --ignore-not-found

# Delete Ingress if exists
kubectl delete ingress chatsphere-ingress -n $NAMESPACE --ignore-not-found

echo "✅ Cleanup finished. Current resources:"
kubectl get all -n $NAMESPACE
