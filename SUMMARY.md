# Enterprise Site Setup - Summary

## What Was Done

I've set up your portfolio to support **two versions** from a single codebase:

1. **Startup Version** (lloydturner.co.uk) - main branch
   - Focused on fintech & Web3 startups
   - "Strategic Design Partner"
   
2. **Enterprise Version** (work.lloydturner.co.uk) - enterprise branch
   - Focused on established companies
   - "Enterprise Design Partner"

## Files Created

1. **`lib/siteConfig.ts`** - Central configuration that switches based on `NEXT_PUBLIC_SITE_TYPE` environment variable
2. **`DEPLOYMENT.md`** - Detailed deployment instructions for Vercel
3. **`NEXT_STEPS.md`** - Step-by-step guide to complete the setup
4. **`SUMMARY.md`** - This file

## Files Modified

1. **`app/layout.tsx`** - Now uses `siteConfig` for metadata
2. **`app/sitemap.ts`** - Now uses `siteConfig` for domain
3. **`app/[slug]/page.tsx`** - Now uses `siteConfig` for project URLs
4. **`package.json`** - Added convenience scripts (`dev:enterprise`, `dev:startup`, etc.)
5. **`README.md`** - Updated deployment section

## How It Works

The site checks the `NEXT_PUBLIC_SITE_TYPE` environment variable:
- If set to `enterprise` → uses work.lloydturner.co.uk domain and enterprise messaging
- If set to `startup` or not set → uses lloydturner.co.uk domain and startup messaging

## Quick Test

```bash
# Test startup version (default)
npm run dev:startup

# Test enterprise version  
npm run dev:enterprise
```

## Next Steps

See `NEXT_STEPS.md` for the complete deployment checklist. Here's the TL;DR:

1. **Commit these changes to main**
   ```bash
   git add .
   git commit -m "Add support for enterprise site version"
   git push origin main
   ```

2. **Create enterprise branch**
   ```bash
   git checkout -b enterprise
   git push -u origin enterprise
   ```

3. **Configure Vercel**
   - Add `work.lloydturner.co.uk` domain
   - Point it to the `enterprise` branch
   - Set `NEXT_PUBLIC_SITE_TYPE=enterprise` for that branch

4. **Configure DNS**
   - Add CNAME: `work` → `cname.vercel-dns.com`

## Benefits of This Approach

✅ **Single codebase** - Easier to maintain and share improvements
✅ **Environment-based** - Easy to test both versions locally
✅ **Independent deployments** - Each branch deploys separately
✅ **Flexible** - Easy to customize content per version using `siteConfig.type`
✅ **Type-safe** - Full TypeScript support

## Future Customization

You can now check which version is running anywhere in your code:

```typescript
import { siteConfig } from '@/lib/siteConfig';

if (siteConfig.type === 'enterprise') {
  // Show enterprise-specific content
} else {
  // Show startup-specific content
}
```

This lets you customize:
- Hero section copy
- Case study selection
- Process descriptions
- CTA messaging
- Testimonials
- Any other content

## Questions?

Refer to:
- `DEPLOYMENT.md` - Full Vercel setup guide
- `NEXT_STEPS.md` - Step-by-step checklist
- `README.md` - Updated with deployment info

All code changes have passed TypeScript and ESLint checks ✅
