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
docker run --rm -i -t -v %cd%/projects/api:/root/api -p 8080:80 kube-node-react-api:latest /bin/sh

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

## Notes

- could have used helm for installing metrics-server (instead of cloning it directly)

## Docs

- https://www.youtube.com/watch?v=h4J8xQWlsQw
- https://github.com/dockersamples/k8s-wordsmith-demo
- https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/
- https://blog.codewithdan.com/enabling-metrics-server-for-kubernetes-on-docker-desktop/
- https://stackoverflow.com/questions/54106725/docker-kubernetes-mac-autoscaler-unable-to-find-metrics
