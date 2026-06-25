# Tanganyikan Cichlids - storefront

A live product catalog that reads directly from your Airtable base and lets
customers order on WhatsApp.

## What's already set up

- Pulls products from Airtable base `app3l8V0WcJvHgtBg`, table `tblySJiI95t8oDzBd`
  (fields: `Name`, `Photos`, `Price`, `Availability`)
- Shows photo/video, name, price (or "Ask for price" if blank), and an
  availability dot
- "Order on WhatsApp" button per product opens a chat to `+2348142124134`
  with a pre-filled message naming the product and price
- A Settings panel where you paste your Airtable token - it's saved only in
  your own browser's storage, never sent anywhere except directly to Airtable

## Deploy this for free on Vercel (5-10 minutes)

You don't need to know how to code for this part - just follow the steps.

### 1. Create a GitHub account (if you don't have one)
Go to github.com and sign up - free.

### 2. Upload this project to GitHub
- Go to github.com/new, create a new repository (e.g. "cichlid-storefront")
- On the new repo page, click "uploading an existing file"
- Drag in every file from this project folder (keep the folder structure -
  `src/App.jsx` and `src/main.jsx` need to stay inside a `src` folder)
- Click "Commit changes"

### 3. Deploy on Vercel
- Go to vercel.com and sign up using your GitHub account - free
- Click "Add New" -> "Project"
- Select the repository you just uploaded
- Vercel will auto-detect it's a Vite app - just click "Deploy"
- Wait about a minute - you'll get a live URL like
  `cichlid-storefront.vercel.app`

### 4. Connect your Airtable
- Open your new live URL
- Click "Settings" in the top right
- Paste in:
  - Your Airtable personal access token (create one at
    airtable.com/create/tokens with `data.records:read` scope, access to
    this base only)
  - Base ID: `app3l8V0WcJvHgtBg` (already filled in)
  - Table ID: `tblySJiI95t8oDzBd` (already filled in)
- Click "Save and load"

That's it - your products will load, and the page will refresh from
Airtable every time someone opens it. Share the Vercel link with customers.

## Updating products later

Just edit Airtable as normal - add products, change prices, mark things
sold. No need to touch this code again. Customers see the update the next
time they load the page.

## If you ever need to change the WhatsApp number

Open `src/App.jsx`, find this line near the top:

```
const WHATSAPP_NUMBER = "2348142124134";
```

Replace the digits with the new number (country code, no `+`, no spaces),
save, and push the change to GitHub - Vercel redeploys automatically.
