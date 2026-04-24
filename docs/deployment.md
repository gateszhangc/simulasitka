# Deployment Runbook

## Target Mapping

- GitHub repository: `gateszhangc/simulasitka`
- Git branch: `main`
- Image repository: `registry.144.91.77.245.sslip.io/simulasitka`
- K8s manifest path: `deploy/k8s/overlays/prod`
- Argo CD application: `simulasitka`
- Primary domain: `simulasitka.lol`

## Required GitHub Secrets

- `REGISTRY_USERNAME`
- `REGISTRY_PASSWORD`

## One-Time Cluster Setup

Apply the Argo resources from this repository:

```bash
kubectl apply -f deploy/argocd/appproject.yaml
kubectl apply -f deploy/argocd/application.yaml
```

Ensure the image pull secret exists in namespace `simulasitka`:

```bash
kubectl -n simulasitka get secret dokploy-fleet-ghcr
```

If the namespace is new, create the same pull secret before the first sync.

## DNS Setup

Cloudflare is the DNS authority for `simulasitka.lol`.

Expected records:

- `A simulasitka.lol -> 89.167.61.228`
- `CNAME www.simulasitka.lol -> simulasitka.lol`

During first cutover keep both records as `DNS only`.

## GSC Setup

Use domain property verification:

- Property: `sc-domain:simulasitka.lol`
- Verification: `DNS_TXT`
- Sitemap: `https://simulasitka.lol/sitemap.xml`

## Validation Checklist

- `kubectl -n argocd get applications.argoproj.io simulasitka`
- `kubectl -n simulasitka get deploy,svc,ingress`
- `curl -I https://simulasitka.lol`
- `curl -I https://www.simulasitka.lol`
- `curl -I https://simulasitka.lol/sitemap.xml`
- `npm test`
