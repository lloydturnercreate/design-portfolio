# Vercel Configuration Guide

## ✅ Completed Steps

- ✅ Code pushed to GitHub `main` branch
- ✅ Code pushed to GitHub `enterprise` branch
- ✅ Vercel project exists: `design-portfolio`

## 🔧 Vercel Configuration Steps

Since Vercel is already connected to your GitHub repo, it will automatically deploy the new `enterprise` branch. However, you need to configure the domain and environment variables.

### Option 1: Using Vercel Dashboard (Recommended)

#### Step 1: Access Your Project
1. Go to https://vercel.com/
2. Navigate to your `design-portfolio` project

#### Step 2: Add the Enterprise Domain
1. Click on **Settings** tab
2. Click on **Domains** in the left sidebar
3. Click **Add** button
4. Enter: `work.lloydturner.co.uk`
5. Click **Add**
6. **Important**: Assign this domain to the `enterprise` branch
   - Click the three dots (⋯) next to the new domain
   - Select **Edit**
   - Under "Git Branch", select `enterprise`
   - Click **Save**

#### Step 3: Configure Environment Variable
1. In **Settings**, click on **Environment Variables**
2. Click **Add New**
3. Fill in:
   - **Name**: `NEXT_PUBLIC_SITE_TYPE`
   - **Value**: `enterprise`
   - **Environments**: Check ✅ **Production** and ✅ **Preview**
   - **Git Branch**: Select `enterprise`
4. Click **Save**

#### Step 4: Redeploy Enterprise Branch
1. Go to **Deployments** tab
2. Find the latest `enterprise` deployment
3. Click the three dots (⋯)
4. Click **Redeploy**
5. Check **Use existing Build Cache**
6. Click **Redeploy**

### Option 2: Using Vercel CLI

If you prefer the command line:

```bash
# Login to Vercel
vercel login

# Link to your project (if not already linked)
cd /Users/lloydturner/Documents/Cursor/Experiments/Portfolio\ 25-26
vercel link --yes

# Add environment variable for enterprise branch
vercel env add NEXT_PUBLIC_SITE_TYPE production

# When prompted:
# - Enter value: enterprise
# - Which environments?: Select Production and Preview
# - Which Git branch?: enterprise

# Add the domain (this still needs to be done in dashboard)
# Then trigger a deployment
git checkout enterprise
vercel --prod
```

## 📡 DNS Configuration

### Add CNAME Record

Go to your domain registrar (where you manage lloydturner.co.uk):

1. Find DNS settings/DNS management
2. Add a new record:
   - **Type**: CNAME
   - **Name**: `work` (or `work.lloydturner.co.uk` depending on your registrar)
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: Auto or 3600

3. Save the record

### Verify DNS Setup

After adding the DNS record, wait 5-60 minutes, then verify:

```bash
# Check if DNS is propagating
dig work.lloydturner.co.uk

# Or use online tools:
# https://dnschecker.org/#CNAME/work.lloydturner.co.uk
```

You should see it pointing to `cname.vercel-dns.com`

## ✅ Verification Checklist

Once everything is configured:

### Test lloydturner.co.uk (Main/Startup Version)
- [ ] Visit https://lloydturner.co.uk
- [ ] Page title shows: "Lloyd Turner | Strategic Design Partner"
- [ ] View page source (Cmd+Option+U)
- [ ] Check `<meta>` tags reference lloydturner.co.uk
- [ ] Description mentions "fintech & Web3 teams"

### Test work.lloydturner.co.uk (Enterprise Version)
- [ ] Visit https://work.lloydturner.co.uk
- [ ] Page title shows: "Lloyd Turner | Enterprise Design Partner"
- [ ] View page source (Cmd+Option+U)
- [ ] Check `<meta>` tags reference work.lloydturner.co.uk
- [ ] Description mentions "established companies transform"

### Check Sitemaps
- [ ] https://lloydturner.co.uk/sitemap.xml (should show lloydturner.co.uk URLs)
- [ ] https://work.lloydturner.co.uk/sitemap.xml (should show work.lloydturner.co.uk URLs)

## 🐛 Troubleshooting

### Domain shows "This domain is not assigned to a deployment"
- Make sure you assigned the domain to the `enterprise` branch in Vercel
- Go to Settings → Domains → Edit domain → Select enterprise branch

### Wrong title/content showing
- Verify environment variable is set: NEXT_PUBLIC_SITE_TYPE=enterprise
- Check it's scoped to the correct branch (enterprise)
- Redeploy the enterprise branch

### DNS not resolving
- DNS can take 5-60 minutes (up to 48 hours in rare cases)
- Check with: `dig work.lloydturner.co.uk`
- Verify CNAME points to `cname.vercel-dns.com`
- Some registrars use `@` or different formats - check their docs

### SSL Certificate Issues
- Vercel automatically provisions SSL certificates
- Can take 5-10 minutes after DNS resolves
- Check Vercel dashboard for SSL status

## 📊 After Setup

### Monitor Both Sites
- Set up Vercel Analytics for both domains
- Add both domains to Google Search Console
- Monitor Core Web Vitals separately

### Future Deployments

**Main site updates:**
```bash
git checkout main
# make changes
git add .
git commit -m "Update main site"
git push origin main
# Vercel auto-deploys to lloydturner.co.uk
```

**Enterprise site updates:**
```bash
git checkout enterprise
# make changes
git add .
git commit -m "Update enterprise site"
git push origin enterprise
# Vercel auto-deploys to work.lloydturner.co.uk
```

**Shared updates (both sites):**
```bash
git checkout main
# make changes
git add .
git commit -m "Shared update"
git push origin main

git checkout enterprise
git merge main
git push origin enterprise
# Both sites get the update
```

## 🎯 Quick Reference

| Setting | Location | Value |
|---------|----------|-------|
| Project | Vercel | design-portfolio |
| Main Domain | Vercel Domains | lloydturner.co.uk → main branch |
| Enterprise Domain | Vercel Domains | work.lloydturner.co.uk → enterprise branch |
| Env Var (Name) | Vercel Env Vars | NEXT_PUBLIC_SITE_TYPE |
| Env Var (Value) | For enterprise branch | enterprise |
| DNS CNAME | Domain Registrar | work → cname.vercel-dns.com |

## Need Help?

If you encounter issues:
1. Check Vercel deployment logs in the dashboard
2. Check browser console for errors (F12)
3. Verify environment variables in Vercel settings
4. Check DNS propagation status
5. Try hard refresh (Cmd+Shift+R)

Everything should work once these configurations are in place!
