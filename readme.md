# Kubernetes, node and react spike (feat. typescript)

## Cmds

```
# Common kubectl cmds
kubectl describe all
kubectl get all
kubectl get all -n kube-system
kubectl delete deployment.apps/api
kubectl delete pods --all --force

# Starting/deleting the cluster
kubectl apply -f kubernetes/
kubectl delete -f kubernetes/

# Deploying/verifying metrics-server
git clone git@github.com:kubernetes-sigs/metrics-server.git kubernetes/metrics-server
# edit metrics-server-deployment.yaml and add args
# - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
# - --kubelet-insecure-tls
kubectl create -f kubernetes/metrics-server/deploy/1.8+/
kubectl top node
kubectl top pods -n kube-system
kubectl get pods -n kube-system
kubectl logs metrics-server-78cb4f6495-926bf -n kube-system
kubectl delete -f kubernetes/metrics-server/deploy/1.8+/

# Testing autoscaling
ab -c 10 -t 120 http://localhost:8080/
kubectl describe hpa

# Misc
kubectl exec -it pod/knr-nginx-5ccd7646bd-627p2 -- /bin/sh

# Build images
docker build -t knr-frontend:latest projects/frontend/docker
docker build -t knr-api:latest projects/api/docker

# Run standalone containers
docker run --rm -i -t -v %cd%:/root/knr -w /root/knr/projects/frontend -p 8082:80 -p 8083:8083 knr-frontend /bin/sh
docker run --rm -i -t -v %cd%:/root/knr -w /root/knr/projects/api -p 8081:80 knr-api /bin/sh

# Logs
kubectl logs --follow service/knr-frontend
kubectl logs --follow pod/knr-frontend-deployment-674bbc5466-lglpt

```

## TODOs

- use swagger (?) to document apis
  - specify models for incoming queries (e.g. YtjSearchQuery)
- these are needed when running yarn in the project root: apk add python make g++

## Notes

- could have used helm for installing metrics-server (instead of cloning it directly)
- parcel 1.x.x typescript support is not very good (https://github.com/parcel-bundler/parcel/issues/1378)
- hardcoded ports are used in kube's yml files and nginx.conf (which is not the way to go)
- kubernetes has an issue with relative mounts on windows https://github.com/docker/for-win/issues/3289

## Docs

### Kubernetes

- https://www.youtube.com/watch?v=h4J8xQWlsQw
- https://github.com/dockersamples/k8s-wordsmith-demo
- https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/
- https://blog.codewithdan.com/enabling-metrics-server-for-kubernetes-on-docker-desktop/
- https://stackoverflow.com/questions/54106725/docker-kubernetes-mac-autoscaler-unable-to-find-metrics

### Typescript

- https://github.com/Microsoft/TypeScript-Node-Starter#typescript-node-starter
- https://medium.com/javascript-in-plain-english/typescript-with-node-and-express-js-why-when-and-how-eb6bc73edd5d
- https://itnext.io/wiring-up-an-api-server-with-express-and-swagger-9bffe0a0d6bd
- https://github.com/lukeautry/tsoa
- https://medium.com/willsonic/swagger-nodejs-typescript-tsoa-15a3f10fabaf
- https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser
- https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
- https://www.netguru.com/codestories/top-5-most-used-patterns-in-oop-with-typescript
- https://dev.to/aligoren/developing-an-express-application-using-typescript-3b1
- https://dev.to/grant_bartlett/getting-started-with-react-typescript-and-parcel-1ocb
- https://fettblog.eu/typescript-react/components/
