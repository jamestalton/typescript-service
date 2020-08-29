export NAME=typescript-service
export VERSION=latest
export NAMESPACE=typescript-service
export REPLICAS=1
export PORT=3000
export IMAGE=jtalton/typescript-service:latest
export INGRESS_PATH=/typescript-service

kubectl create namespace typescript-service | true

mkdir -p tmp

cat deploy/secret.yaml | envsubst > tmp/secret.yaml
cat deploy/configmap.yaml | envsubst > tmp/configmap.yaml
cat deploy/deployment.yaml | envsubst > tmp/deployment.yaml
cat deploy/service.yaml | envsubst > tmp/service.yaml
cat deploy/ingress.yaml | envsubst > tmp/ingress.yaml

kubectl apply -f tmp