# Bandwidth Functions

A Next.js application hosted on Vercel that allows you to perform various functions using the Bandwidth API.

## Features

- Check Bandwidth API connection status
- View and manage phone numbers
- Send SMS messages
- Easy to extend with additional Bandwidth API functions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `env.template` to `.env.local`
   - Fill in your Bandwidth API credentials:
     - `BANDWIDTH_USERNAME` - Your Bandwidth API username
     - `BANDWIDTH_PASSWORD` - Your Bandwidth API password
     - `BANDWIDTH_ACCOUNT_ID` - Your Bandwidth account ID
     - `BANDWIDTH_APPLICATION_ID` - (Optional) Your application ID for messaging

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Step 1: Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Bandwidth Functions app"
```

### Step 2: Push to GitHub/GitLab/Bitbucket

1. Create a new repository on GitHub (or your preferred Git hosting service)
2. Push your code:

```bash
git remote add origin <your-repository-url>
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in (or create an account)
2. Click **"Add New Project"** or **"Import Project"**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will auto-detect Next.js - click **"Deploy"**

### Step 4: Add Environment Variables

**Important:** Before the first deployment completes, add your environment variables:

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add the following variables (one at a time):

   - **BANDWIDTH_USERNAME** - Your Bandwidth API username
   - **BANDWIDTH_PASSWORD** - Your Bandwidth API password  
   - **BANDWIDTH_ACCOUNT_ID** - Your Bandwidth account ID
   - **BANDWIDTH_APPLICATION_ID** - (Optional) Your application ID for messaging

3. For each variable, select **"Production"**, **"Preview"**, and **"Development"** environments
4. Click **"Save"** for each variable

### Step 5: Redeploy

After adding environment variables:
1. Go to the **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Select **"Redeploy"**
4. Your app will rebuild with the environment variables

### Your App is Live! 🎉

Vercel will provide you with a URL like: `https://your-project-name.vercel.app`

You can also set up a custom domain in the Vercel project settings.

## API Endpoints

### GET `/api/bandwidth/status`
Check the connection status to the Bandwidth API.

### GET `/api/bandwidth/numbers`
Retrieve all phone numbers associated with your account.

### POST `/api/bandwidth/message`
Send an SMS message.

**Request body:**
```json
{
  "to": "+1234567890",
  "from": "+0987654321",
  "text": "Hello from Bandwidth!"
}
```

### POST `/api/bandwidth/add-campaign`
Add a campaign to telephone numbers.

**Request body:**
```json
{
  "campaignId": "CVZJ1EL",
  "phoneNumbers": ["+12549465498", "+13612714600"],
  "sms": "ON"
}
```

### POST `/api/bandwidth/remove-campaign`
Remove a campaign from telephone numbers.

**Request body:**
```json
{
  "phoneNumbers": ["+12549465498", "+13612714600"],
  "sms": "ON"
}
```

### POST `/api/bandwidth/transfer-tns`
Transfer telephone numbers between sub-accounts/locations.

**Request body:**
```json
{
  "subAccountId": 33376,
  "locationId": 1127896,
  "phoneNumbers": ["+12022401194", "+12022351122"]
}
```

## Adding More Functions

To add more Bandwidth API functions:

1. Add a new function in `src/lib/bandwidth.ts`
2. Create a new API route in `src/app/api/bandwidth/[function-name]/route.ts`
3. Optionally add a UI component to call the new function

## Resources

- [Bandwidth API Documentation](https://dev.bandwidth.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
