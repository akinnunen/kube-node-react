# Kubernetes, node and react spike

## Cmds

```
# Deploying using a compose file
docker stack deploy -c docker-compose.yml knr
docker stack rm knr

# Common kubectl cmds
kubectl describe all
kubectl get all
kubectl get all -n kube-system
kubectl delete deployment.apps/api
kubectl delete pods --all --force

# Building/testing the containers
docker-compose build
docker run --rm -i -t -v %cd%:/root/knr -w /root/knr -p 8080:80 node:13-alpine /bin/sh

# Starting/deleting the cluster
kubectl apply -f kube.yml
kubectl delete -f kube.yml

# Deploying/verifying metrics-server
git clone git@github.com:kubernetes-sigs/metrics-server.git projects/metrics-server
kubectl create -f projects/metrics-server/deploy/1.8+/
kubectl top node
kubectl top pods -n kube-system
kubectl get pods -n kube-system
kubectl logs metrics-server-78cb4f6495-926bf -n kube-system
kubectl delete -f projects/metrics-server/deploy/1.8+/

# Testing autoscaling
ab -c 10 -t 120 http://localhost:8080/
kubectl describe hpa
```

## TODOs

- consider using more OOP
  - https://dev.to/aligoren/developing-an-express-application-using-typescript-3b1
- use swagger (?) to document apis
  - specify models for incoming queries (e.g. YtjSearchQuery)

## Notes

- could have used helm for installing metrics-server (instead of cloning it directly)

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
