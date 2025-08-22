#!/bin/bash
set -e

NAMESPACE=default   # change if using custom namespace
LOCAL_PORT=5000     # port on localhost
SERVICE_PORT=80     # service port (from service.yaml)

echo "🔌 Starting port-forward from localhost:$LOCAL_PORT -> service/chatsphere-service:$SERVICE_PORT"
echo "👉 Press Ctrl+C to stop."

kubectl port-forward service/chatsphere-service $LOCAL_PORT:$SERVICE_PORT -n $NAMESPACE
