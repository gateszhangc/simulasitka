# Simulasi TKA

Static keyword site for `simulasi tka`, deployed through GitHub Actions, Kustomize, Argo CD, and Kubernetes.

## Deployment Mapping

- GitHub repository: `gateszhangc/simulasitka`
- Git branch: `main`
- Image repository: `registry.144.91.77.245.sslip.io/simulasitka`
- K8s manifest path: `deploy/k8s/overlays/prod`
- Argo CD application: `simulasitka`
- Primary domain: `simulasitka.lol`

Route:

`gateszhangc/simulasitka -> main -> registry.144.91.77.245.sslip.io/simulasitka -> deploy/k8s/overlays/prod -> simulasitka`

## Local Commands

```bash
npm install
npm run brand
npm test
npm start
```

## Release Flow

1. Push to `main`
2. GitHub Actions builds and pushes the image
3. Workflow updates `deploy/k8s/overlays/prod/kustomization.yaml` with the new `newTag`
4. Argo CD auto-syncs the application
5. cert-manager issues TLS for `simulasitka.lol` and `www.simulasitka.lol`

## DNS And GSC

- DNS is managed by Cloudflare
- Apex A record points to `89.167.61.228`
- `www` is a CNAME to `simulasitka.lol`
- GSC property is the domain property `sc-domain:simulasitka.lol`
- Sitemap URL is `https://simulasitka.lol/sitemap.xml`

## Cluster Notes

- Namespace: `simulasitka`
- Registry pull secret name: `dokploy-fleet-ghcr`
- Ingress class: `nginx`
- Cluster issuer: `letsencrypt-prod`
