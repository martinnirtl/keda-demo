# Horizontal Pod Autoscaling with Dynatrace and KEDA

This is a demo project showcasing Dynatrace and KEDA for horizontal pod autoscaling (HPA).

## Setup

Prerequisits

- Kubernetes cluster
- [KEDA](https://keda.sh/docs/2.5/deploy/) installed in your cluster

The Kubernetes deployment files are placed in _deployment/kubernetes_. Before applying the files, please update the following line in _keda.yaml_ (marked with TODO) by adding your **environment/tenant url**:

```yaml
triggers:
  - type: metrics-api
    metadata:
      targetValue: '100'
      # TODO Replace <tenant-baseurl>
      url: '<tenant-baseurl>/api/v2/metrics/query?metricSelector=builtin:service.requestCount.total:filter(and(in("dt.entity.service",entitySelector("type(service),entityName(~"greeting-service~")")))):splitBy():sum:timeshift(-3m):rollup(avg,3m):last'
      valueLocation: 'result.0.data.0.values.0'
      authMode: apiKey
      keyParamName: Authorization
    authenticationRef:
      name: dynatrace-keda-auth
```

Also, generate an API token with **read metrics (v2)** permission in Dynatrace and create a secret by running the following command (replace <token>):

```bash
kubectl create secret generic dynatrace-keda-secret --from-literal token="Api-Token <token>"
```

Afterwards you can apply the demo by running `kubectl apply -f deployment/kubernetes`.

> Tested on Kubernetes v1.20.9 - CronJobs became stable w/ version 1.21 (apiVersion: batch/v1)

### Having problems or facing issues?

Reach out to me via email: [martin.nirtl@dynatrace.com](mailto:martin.nirtl@dynatrace.com)
