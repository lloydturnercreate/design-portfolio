# Deployment Guide

This project supports two versions of the site:
- **Startup version**: lloydturner.co.uk (main branch)
- **Enterprise version**: work.lloydturner.co.uk (enterprise branch)

## Branch Setup

### Main Branch (Startup Version)
- **Branch**: `main`
- **Domain**: lloydturner.co.uk
- **Environment Variable**: `NEXT_PUBLIC_SITE_TYPE=startup` (or not set)

### Enterprise Branch
- **Branch**: `enterprise`
- **Domain**: work.lloydturner.co.uk
- **Environment Variable**: `NEXT_PUBLIC_SITE_TYPE=enterprise`

## Creating the Enterprise Branch

```bash
# Create and switch to the enterprise branch
git checkout -b enterprise

# Push to remote
git push -u origin enterprise
```

## Vercel Deployment Setup

### For Main Branch (lloydturner.co.uk)
1. Go to Vercel project settings
2. Ensure the production branch is set to `main`
3. Domain: `lloydturner.co.uk`
4. Environment Variables:
   - `NEXT_PUBLIC_SITE_TYPE` = `startup` (optional, this is the default)

### For Enterprise Branch (work.lloydturner.co.uk)
1. In Vercel project settings, go to "Git"
2. Add a new branch deployment for `enterprise`
3. Go to "Domains" and add: `work.lloydturner.co.uk`
4. In "Environment Variables":
   - Add `NEXT_PUBLIC_SITE_TYPE` = `enterprise`
   - Set scope to: Production, Preview (enterprise branch)

## DNS Configuration

Add a CNAME record for the enterprise subdomain:
```
Type: CNAME
Name: work
Value: cname.vercel-dns.com
TTL: Auto
```

## Local Development

### Test Startup Version
```bash
npm run dev
# or explicitly:
NEXT_PUBLIC_SITE_TYPE=startup npm run dev
```

### Test Enterprise Version
```bash
NEXT_PUBLIC_SITE_TYPE=enterprise npm run dev
```

## Key Differences Between Versions

The site configuration is managed in `lib/siteConfig.ts`:

| Feature | Startup | Enterprise |
|---------|---------|------------|
| Domain | lloydturner.co.uk | work.lloydturner.co.uk |
| Title | Strategic Design Partner | Enterprise Design Partner |
| Description | Focuses on fintech & Web3 startups | Focuses on enterprise transformation |
| Keywords | startup design, Web3, fintech | enterprise design, design transformation |

## Making Changes

### Changes to Both Versions
If you want a change to appear on both sites:
1. Make the change on `main`
2. Merge `main` into `enterprise`:
```bash
git checkout enterprise
git merge main
git push origin enterprise
```

### Enterprise-Only Changes
If you want a change only on the enterprise version:
1. Make the change on the `enterprise` branch
2. Commit and push:
```bash
git checkout enterprise
# make changes
git add .
git commit -m "Enterprise-specific update"
git push origin enterprise
```

## Customizing Content Per Version

You can check which version is running using:

```typescript
import { siteConfig } from '@/lib/siteConfig';

// In your component
if (siteConfig.type === 'enterprise') {
  // Enterprise-specific content
} else {
  // Startup-specific content
}
```

## Troubleshooting

### Wrong domain showing in metadata
- Check that `NEXT_PUBLIC_SITE_TYPE` is set correctly in Vercel
- Rebuild the project after changing environment variables

### Changes not appearing
- Ensure you're pushing to the correct branch
- Check Vercel deployment logs
- Verify environment variables are set for the correct branch scope
