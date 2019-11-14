# Kubernetes, nodejs and react spike (feat. typescript)

I created this project during 5 days (\~30 hours). The goal was to teach myself the very basics of kubernetes and typescript. Here's what this monorepo holds:

- kubernetes cluster for local development (that scales automatically based on load)
- react+ts frontend for searching Finnish companies by name
- nodejs+ts api that exposes ytj.fi's search form as a rest api
- nginx reverse proxy
- shared @knr/models module (with typescript interfaces) that's used in both frontend and api
- yarn workspaces for managing dependencies
- jest powered testing

There are still quite a few improvements I might/should do in the future. More on those under the [TODOs](#todos) topic.

## Starting the environment

You'll need Kubernetes installed and kubectl and docker available on your command line. If you want to see autoscaling in action, make sure you have `metrics-server` installed before proceeding (see [Installing metrics-server](#installing-metrics-server)).

1. build the docker images for frontend and api
    - `docker build -t knr-frontend:latest projects/frontend/docker`
    - `docker build -t knr-api:latest projects/api/docker`
2. start the kubernetes cluster
    - `kubectl apply -f kubernetes/`
3. check that everything is running
    - `kubectl get all`
4. open app in your browser
    - [http://localhost:8080/](http://localhost:8080/)
5. generate load agaist the api (if you wanna see it autoscale)
    - `ab -c 10 -t 120 http://localhost:8080/api/ytj/search?name=hhh`
6. once you're done remove the whole environment with
    - `kubectl delete -f kubernetes/`

## Installing metrics-server (optional)

1. `git clone git@github.com:kubernetes-sigs/metrics-server.git kubernetes/metrics-server`
2. edit `metrics-server-deployment.yaml` and add the following args
    - `--kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname`
    - `--kubelet-insecure-tls`
3. `kubectl create -f kubernetes/metrics-server/deploy/1.8+/`

## Useful commands

### Kubernetes

- list resources
    - `kubectl get all`
    - `kubectl get all -n kube-system` (incl. system resources)
    - `kubectl describe all`
- jump into a pod
    - `kubectl exec -it pod/knr-nginx-5ccd7646bd-627p2 -- /bin/sh`
- show service/pod logs
    - `kubectl logs --follow service/knr-frontend`
    - `kubectl logs --follow service/knr-api`
    - `kubectl logs --follow pod/knr-frontend-deployment-674bbc5466-lglpt`
- show horizontal pod autoscaler details
    - `kubectl describe hpa`
- show metrics-server logs
    - `kubectl get pods -n kube-system`
    - `kubectl logs metrics-server-78cb4f6495-926bf -n kube-system`
- show node/pod resource usage
    - `kubectl top node`
    - `kubectl top pods`
    - `kubectl top pods -n kube-system`

### Docker

- run frontend/api without kubernetes
    - `docker run --rm -i -t -v %cd%:/root/knr -w /root/knr/projects/frontend -p 8082:80 -p 8083:8083 knr-frontend /bin/sh`
    - `docker run --rm -i -t -v %cd%:/root/knr -w /root/knr/projects/api -p 8081:80 knr-api /bin/sh`

## TODOs

- add a loading icon for the search
- specify models for incoming queries (e.g. YtjSearchQuery)

## Notes

### Kubernetes

- could have used helm for installing metrics-server (instead of cloning it directly)
- hardcoded ports are used in kube's yml files and nginx.conf (which is not the way to go)
- kubernetes has an issue with relative mounts on windows https://github.com/docker/for-win/issues/3289

### Frontend

- parcel 1.x.x typescript support is not very good (https://github.com/parcel-bundler/parcel/issues/1378)
- hoc's
- tests

### Api

- handleAsync should be moved elsewhere
- swagger
- validation

### Models

- better name (?)

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
