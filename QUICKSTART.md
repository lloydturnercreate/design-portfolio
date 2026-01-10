# Quick Start Guide - Enterprise Site

## ✅ What's Done

- ✅ Created site configuration system
- ✅ Updated all files to use dynamic config
- ✅ Committed changes to main branch
- ✅ Created enterprise branch locally
- ✅ All TypeScript/ESLint checks passing

## 🚀 What You Need to Do

### 1. Push to GitHub (Manual)

```bash
# Push main branch
git push origin main

# Push enterprise branch
git push origin enterprise
```

### 2. Test Locally (Optional but Recommended)

```bash
# Test startup version
npm run dev:startup
# Visit http://localhost:3000 - should say "Strategic Design Partner"

# Test enterprise version
npm run dev:enterprise
# Visit http://localhost:3000 - should say "Enterprise Design Partner"
```

### 3. Configure Vercel

#### Step 1: Add Domain
1. Go to your Vercel project
2. Settings → Domains
3. Add: `work.lloydturner.co.uk`
4. Assign to: `enterprise` branch

#### Step 2: Set Environment Variable
1. Settings → Environment Variables
2. Add variable:
   - **Key**: `NEXT_PUBLIC_SITE_TYPE`
   - **Value**: `enterprise`
   - **Environments**: ✅ Production, ✅ Preview
   - **Git Branch**: Select `enterprise`

### 4. Configure DNS

In your domain registrar:
- **Type**: CNAME
- **Name**: `work`
- **Value**: `cname.vercel-dns.com`

### 5. Deploy & Test

After DNS propagates (5-60 minutes):

**Test lloydturner.co.uk:**
- Check page title: "Strategic Design Partner"
- View source: metadata should reference lloydturner.co.uk

**Test work.lloydturner.co.uk:**
- Check page title: "Enterprise Design Partner"  
- View source: metadata should reference work.lloydturner.co.uk

## 🎨 Customizing Content

To show different content per version:

```typescript
import { siteConfig } from '@/lib/siteConfig';

export default function Hero() {
  return (
    <div>
      {siteConfig.type === 'enterprise' ? (
        <h1>Enterprise-focused headline</h1>
      ) : (
        <h1>Startup-focused headline</h1>
      )}
    </div>
  );
}
```

## 📚 Documentation

- **`SUMMARY.md`** - Overview of what was done
- **`DEPLOYMENT.md`** - Detailed Vercel setup
- **`NEXT_STEPS.md`** - Complete step-by-step guide
- **`README.md`** - Updated with deployment info

## 🔄 Future Workflow

### Making Changes to Both Sites
```bash
git checkout main
# make changes
git add .
git commit -m "Update feature"
git push origin main

git checkout enterprise
git merge main
git push origin enterprise
```

### Enterprise-Only Changes
```bash
git checkout enterprise
# make changes
git add .
git commit -m "Enterprise-specific update"
git push origin enterprise
```

## 🆘 Troubleshooting

**Wrong domain in metadata?**
- Check `NEXT_PUBLIC_SITE_TYPE` is set in Vercel
- Trigger new deployment after changing env vars

**Site not loading at work.lloydturner.co.uk?**
- Check DNS with: `dig work.lloydturner.co.uk`
- Wait up to 48 hours for DNS propagation
- Verify CNAME points to `cname.vercel-dns.com`

**Same content on both sites?**
- Verify environment variable is set for enterprise branch
- Check Vercel deployment logs
- Clear browser cache

## 📊 Success Checklist

- [ ] Both branches pushed to GitHub
- [ ] Vercel domain added: work.lloydturner.co.uk
- [ ] Environment variable set for enterprise branch
- [ ] DNS CNAME record added
- [ ] lloydturner.co.uk shows "Strategic Design Partner"
- [ ] work.lloydturner.co.uk shows "Enterprise Design Partner"
- [ ] Both sitemaps show correct domain
- [ ] Metadata correct on both sites

## 🎯 Next Enhancement Ideas

Once deployed, consider customizing:
- [ ] Different hero section copy per version
- [ ] Different case study selection (highlight relevant clients)
- [ ] Different process descriptions
- [ ] Different CTAs (e.g., "Book a Discovery Call" vs "Start Your Project")
- [ ] Different social proof/testimonials
- [ ] A/B test messaging effectiveness
