# Next Steps: Enterprise Site Setup

This document outlines the steps to complete the enterprise site deployment.

## ✅ Completed

1. ✅ Created `lib/siteConfig.ts` - Central configuration for both site versions
2. ✅ Updated `app/layout.tsx` - Uses dynamic site configuration
3. ✅ Updated `app/sitemap.ts` - Uses dynamic domain
4. ✅ Updated `app/[slug]/page.tsx` - Uses dynamic domain in metadata
5. ✅ Updated `package.json` - Added convenience scripts for testing both versions
6. ✅ Updated `README.md` - Documented the dual-site setup
7. ✅ Created `DEPLOYMENT.md` - Detailed deployment instructions
8. ✅ All TypeScript type checks passing
9. ✅ All ESLint checks passing

## 📋 To Do

### 1. Create the Enterprise Branch

```bash
# Make sure all changes are committed on main first
git add .
git commit -m "Add support for enterprise site version with dynamic configuration"
git push origin main

# Create and push enterprise branch
git checkout -b enterprise
git push -u origin enterprise
```

### 2. Set Up Vercel Deployment

#### For Main Branch (Already exists)
- Domain: `lloydturner.co.uk`
- Branch: `main`
- No environment variable needed (defaults to startup)

#### For Enterprise Branch (New)
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Git**
3. Under "Production Branch", ensure `main` is selected
4. The `enterprise` branch will automatically deploy to preview URLs

5. Navigate to **Settings** → **Domains**
6. Click "Add Domain"
7. Enter: `work.lloydturner.co.uk`
8. Assign it to the `enterprise` branch deployment

9. Navigate to **Settings** → **Environment Variables**
10. Add new variable:
    - **Key**: `NEXT_PUBLIC_SITE_TYPE`
    - **Value**: `enterprise`
    - **Environments**: Production, Preview
    - **Git Branch**: Select `enterprise`

### 3. Configure DNS

In your domain registrar (where lloydturner.co.uk is hosted):

1. Add a new CNAME record:
   - **Type**: CNAME
   - **Name**: `work`
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: Auto (or 3600)

2. Wait for DNS propagation (can take 5-60 minutes)

### 4. Test Locally

```bash
# Test startup version (default)
npm run dev:startup
# Visit http://localhost:3000
# Should show "Strategic Design Partner" and startup-focused content

# Test enterprise version
npm run dev:enterprise
# Visit http://localhost:3000
# Should show "Enterprise Design Partner" and enterprise-focused content
```

### 5. Verify Deployment

After Vercel deployment completes:

1. Check `lloydturner.co.uk`:
   - Title should be "Strategic Design Partner"
   - Description mentions fintech & Web3 startups
   
2. Check `work.lloydturner.co.uk`:
   - Title should be "Enterprise Design Partner"
   - Description mentions enterprise transformation

### 6. Customize Enterprise Content (Optional)

Now that the infrastructure is set up, you can customize the enterprise version further:

```typescript
// In any component, check which version is running:
import { siteConfig } from '@/lib/siteConfig';

if (siteConfig.type === 'enterprise') {
  // Show enterprise-specific content
  // e.g., different case studies, different CTA, etc.
} else {
  // Show startup-specific content
}
```

Consider customizing:
- Hero section copy
- Case study selection (show more enterprise clients)
- Process section (focus on enterprise challenges)
- CTA buttons (different messaging)
- Testimonials/social proof

## 🔄 Workflow: Making Changes

### Changes to Both Sites
```bash
# Work on main branch
git checkout main
# Make changes
git add .
git commit -m "Update shared feature"
git push origin main

# Merge into enterprise
git checkout enterprise
git merge main
git push origin enterprise
```

### Enterprise-Only Changes
```bash
git checkout enterprise
# Make changes
git add .
git commit -m "Enterprise-specific update"
git push origin enterprise
```

## 🐛 Troubleshooting

### Wrong domain showing
- Verify `NEXT_PUBLIC_SITE_TYPE` is set correctly in Vercel
- Check it's scoped to the correct branch
- Trigger a new deployment after changing env vars

### DNS not resolving
- DNS can take up to 48 hours (usually 5-60 minutes)
- Use `dig work.lloydturner.co.uk` to check DNS propagation
- Ensure CNAME points to `cname.vercel-dns.com`

### Different content not showing
- Clear browser cache
- Check Vercel deployment logs
- Verify environment variable is set for the correct branch

## 📊 Monitoring

After deployment, monitor:
- Vercel Analytics for both domains
- Google Search Console (add both domains)
- Core Web Vitals for both versions
- Different audience engagement patterns

## 🎯 Success Criteria

- ✅ Main site (lloydturner.co.uk) shows startup-focused content
- ✅ Enterprise site (work.lloydturner.co.uk) shows enterprise-focused content
- ✅ Both sites deploy independently
- ✅ Changes to main can be merged to enterprise
- ✅ Enterprise-specific changes don't affect main site
- ✅ All metadata (title, description, OG tags) are correct per version
- ✅ Sitemap.xml shows correct domain per version
