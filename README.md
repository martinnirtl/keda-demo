# Horizontal Pod Autoscaling with Dynatrace and KEDA

This is a demo project showcasing Dynatrace and KEDA for horizontal pod autoscaling (HPA).

## Setup

Prerequisits

- [KEDA](https://keda.sh/docs/2.5/deploy/) installed in your cluster
- [k6](https://k6.io/docs/getting-started/installation/) on your machine or container

The Kubernetes deployment files are placed in _deployment/kubernetes_. Before applying the files, please update _keda.yaml_ with your **environment/tenant url** and add an **API token** with `metrics read` permission.

> Tested on Kubernetes v1.20.9 - CronJobs became stable w/ version 1.21 (apiVersion: batch/v1)

### Having problems or facing issues?

Reach out to me via email: [martin.nirtl@dynatrace.com](mailto:martin.nirtl@dynatrace.com)
