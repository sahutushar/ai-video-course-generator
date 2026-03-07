# Vercel Deployment Fix Guide

## Critical Steps to Fix Your Deployment

### 1. Add Environment Variables to Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add ALL of these:

**Database:**
- `DATABASE_URL` = (your Neon database URL)

**Clerk Authentication:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = pk_test_...
- `CLERK_SECRET_KEY` = sk_test_...
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = /sign-in
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = /sign-up
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` = /
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` = /

**Azure OpenAI:**
- `AZURE_OPENAI_API_KEYS` = (your key)
- `AZURE_OPENAI_ENDPOINT` = https://jaint-mmaalyvv-swedencentral.cognitiveservices.azure.com
- `AZURE_OPENAI_DEPLOYMENT_NAME` = gpt-4o
- `AZURE_OPEN_AI_VERSION` = 2024-12-01-preview

**Fonada TTS:**
- `FONADALAB_API_KEYS` = (your key)

**Azure Storage:**
- `AZURE_STORAGE_CONNECTION_STRING` = (your connection string)
- `AZURE_STORAGE_CONTAINER_NAME` = audio
- `AZURE_STORAGE_PUBLIC_BASE_URL` = https://coursevideogenerator.blob.core.windows.net

**Groq:**
- `GROQ_API_KEY` = (your key)

**Other:**
- `NEXT_PRIVATE_TURBO` = false

### 2. Update Clerk Dashboard

1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to "Domains" section
4. Add your Vercel domain (e.g., `your-app.vercel.app`)
5. Update allowed redirect URLs to include your Vercel domain

### 3. Redeploy

After adding environment variables:

```bash
git add .
git commit -m "fix: add middleware and deployment configs"
git push
```

Or trigger a redeploy from Vercel dashboard.

### 4. Verify Deployment

Check these features:
- ✅ Authentication (sign in/sign up)
- ✅ Course generation
- ✅ Video content generation
- ✅ Audio file storage
- ✅ Database operations

## Common Issues & Solutions

### Issue: "Authentication failed"
**Solution:** Verify Clerk environment variables are set correctly in Vercel and domain is added in Clerk dashboard.

### Issue: "API timeout"
**Solution:** Upgrade to Vercel Pro plan for 300s timeout, or optimize API routes.

### Issue: "Database connection failed"
**Solution:** Check DATABASE_URL is correct and Neon database allows connections from Vercel IPs.

### Issue: "Azure storage failed"
**Solution:** Verify AZURE_STORAGE_CONNECTION_STRING and container exists.

## Files Modified

1. ✅ `proxy.ts` - Already has Clerk authentication (no changes needed)
2. ✅ `vercel.json` - Configured function timeouts
3. ✅ `.env.example` - Documented required variables
4. ✅ `.env` - Fixed Azure storage URL (removed quotes)
5. ✅ API routes - Added maxDuration exports

## Next Steps

1. Copy all values from `.env` to Vercel environment variables
2. Update Clerk dashboard with Vercel domain
3. Redeploy
4. Test all features

## Important Notes

- Never commit `.env` file to git (already in .gitignore)
- Use `.env.example` as reference for required variables
- Vercel Hobby plan has 60s timeout, Pro has 300s
- Some features may need Pro plan for longer processing times
