# UbiTask App

A lightweight, shareable task management application with collaborative commenting. All data is stored in the URL, making tasks instantly shareable and requiring no backend infrastructure.

## Features

- **URL-based Persistence**: All tasks and comments are encoded in the URL hash
- **Shareable Tasks**: Copy and share the URL to share your entire task list
- **One-Click Copy**: Copy button in the navigation bar for easy sharing
- **Smart Link Shortening**: Copy tries to shorten long share URLs and falls back automatically
- **Multi-user Comments**: Anyone can add comments with their name (username is cached for convenience)
- **Drag & Drop Reordering**: Organize tasks by dragging them
- **Inline Editing**: Edit task titles and descriptions directly
- **No Database Required**: Everything works client-side

## Usage

### Creating Tasks

1. Click the floating `+` button in the bottom-right corner
2. Enter a task title (required) and description (optional)
3. Click "Create Task"

### Managing Tasks

- **Expand/Collapse**: Click anywhere on a task to view its description and comments
- **Edit**: Hover over a task and click the edit icon, modify the content, then click the checkmark
- **Delete**: Hover over a task and click the trash icon, confirm deletion
- **Reorder**: Hover over a task and drag using the grip icon

### Adding Comments

1. Expand a task by clicking on it
2. Enter your name in the "Name" field (this will be cached automatically)
3. Enter your comment in the "Add a comment..." field
4. Click "Post" or press Enter

**Note**: Your username is saved locally and will be pre-filled the next time you comment.

### Sharing Tasks

Click the "Copy Link" button in the top-right corner of the navigation bar to copy a share URL to your clipboard. The app first attempts to shorten the URL for easier sharing and falls back to the full URL if shortening is unavailable. Anyone opening the copied URL will see the exact same tasks and comments.

Alternatively, you can copy the URL directly from your browser's address bar.

## Deployment

This is a static web application consisting of three files:

- `index.html` - Main HTML structure
- `script.js` - Application logic
- Font Awesome CSS (loaded from CDN or can be hosted locally)

### Cloudflare Pages

1. **Prepare Your Repository**
   - Create a new Git repository
   - Add `index.html` and `script.js` to the repository
   - Commit and push to GitHub/GitLab

2. **Deploy to Cloudflare Pages**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Go to "Workers & Pages" → "Pages"
   - Click "Create a project" → "Connect to Git"
   - Select your repository
   - Configure build settings:
     - **Build command**: Leave empty (no build needed)
     - **Build output directory**: `/`
   - Click "Save and Deploy"

3. **Custom Domain (Optional)**
   - In your project settings, go to "Custom domains"
   - Click "Set up a custom domain"
   - Follow the instructions to configure your domain

### GitHub Pages

1. Create a repository with `index.html` and `script.js`
2. Go to repository Settings → Pages
3. Select the branch to deploy (usually `main`)
4. Select root folder `/`
5. Click Save
6. Your app will be available at `https://username.github.io/repository-name`

### Netlify

1. **Via Drag & Drop**
   - Go to [Netlify](https://www.netlify.com/)
   - Drag your folder containing `index.html` and `script.js` to the deploy zone

2. **Via Git**
   - Click "New site from Git"
   - Connect your repository
   - Build settings: Leave empty (no build needed)
   - Publish directory: `/`
   - Click "Deploy site"

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to your project folder
3. Run `vercel`
4. Follow the prompts

Or deploy via the [Vercel Dashboard](https://vercel.com/new):

- Import your Git repository
- Leave build settings empty
- Click "Deploy"

### Local Development

Simply open `index.html` in a web browser. No server required.

For a better development experience with live reload:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Any modern browser with ES6 support

## License

This project is open source and available for personal and commercial use.
