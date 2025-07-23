# Serin App Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub repository with your code
- Supabase project (already configured)
- Resend account with API key

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Import Project" and select your repository
3. Vercel auto-detects Vite configuration - click "Deploy"
4. Your app will be deployed at `https://your-repo-name.vercel.app`

### Step 3: Configure Environment Variables

#### Option A: Use Supabase Integration (Automatic)
1. Go to Vercel Dashboard → Integrations → Browse
2. Find and install "Supabase"
3. Connect your Supabase project
4. All `VITE_SUPABASE_*` variables are automatically synced

#### Option B: Manual Configuration
1. Go to Vercel Project → Settings → Environment Variables
2. Add these variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_RESEND_API_KEY`: Your Resend API key

### Step 4: Update Supabase Settings
1. Go to your Supabase Dashboard
2. Navigate to Authentication → URL Configuration
3. Update settings:
   - **Site URL**: `https://your-app-name.vercel.app`
   - **Additional Redirect URLs**: Add these lines:
     ```
     http://localhost:8080/**
     https://your-app-name-*.vercel.app/**
     ```

### Step 5: Test Your Deployment
- Visit your Vercel URL
- Test Google OAuth login
- Create a new account to test welcome email
- Verify all features work correctly

## Environment Variables Reference

### Required Variables
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RESEND_API_KEY=your-resend-api-key
```

### Development Setup
1. Copy `.env.example` to `.env.local`
2. Fill in your actual values
3. Never commit `.env.local` to git

## Custom Domain Setup (Optional)

### 1. Add Domain to Vercel
1. Vercel Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 2. Update Supabase Redirect URLs
- Replace Vercel URLs with your custom domain
- Update Site URL to your custom domain

### 3. Resend Custom Domain (Optional)
1. Add your domain to Resend dashboard
2. Configure DNS records (SPF, DKIM, DMARC)
3. Update `src/utils/emailService.ts` from field:
   ```typescript
   from: 'Serin <noreply@yourdomain.com>'
   ```

## Troubleshooting

### OAuth Issues
- Verify redirect URLs in Supabase match exactly
- Check that Site URL is set correctly
- Ensure environment variables are deployed

### Email Issues
- Check Resend API key is set correctly
- Verify domain is verified in Resend
- Check browser console for errors

### Build Issues
- Check that all environment variables are prefixed with `VITE_`
- Verify no TypeScript errors in your code
- Check Vercel build logs for specific errors

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables configured
- [ ] Supabase redirect URLs updated
- [ ] Google OAuth tested
- [ ] Welcome emails working
- [ ] All features tested
- [ ] Custom domain configured (optional)
- [ ] Error monitoring setup (optional)

## Cost Overview

### Free Tier (Good for starting)
- **Vercel**: Free (unlimited personal projects)
- **Supabase**: Free (500MB database, 50MB file storage)
- **Resend**: Free (3,000 emails/month)
- **Total**: $0/month

### Paid Upgrades (When needed)
- **Custom Domain**: $10-15/year
- **Vercel Pro**: $20/month (more builds, analytics)
- **Supabase Pro**: $25/month (more storage, compute)
- **Resend Pro**: $20/month (50,000 emails/month)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set
4. Test locally first to isolate the issue