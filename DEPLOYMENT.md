# Deploy to Cloudflare Pages

1. Go to https://pages.cloudflare.com
2. Click "Connect to Git" and authorize GitHub
3. Select repository: `nexusmedia`
4. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Click "Save and Deploy"

Your site will be live on Cloudflare!

## GitHub Pages (Alternative)

To deploy to GitHub Pages first:

```bash
npm install
npm run deploy
```

Your app will be available at: https://gendesu4work.github.io/nexusmedia/
