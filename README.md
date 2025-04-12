# OKR Tree - Microsoft Teams App

OKR Tree is a Microsoft Teams application that helps your organization track Objectives and Key Results. Visualize your organization's goals and track progress in a hierarchical tree structure.

## Features

- Create and manage OKR trees
- Add objectives and sub-objectives
- Create tasks associated with objectives
- Assign tasks to team members
- Track progress with visual indicators
- View tasks assigned to you

## Prerequisites

- Node.js 18 or newer
- npm or yarn
- Microsoft 365 Developer account (for testing and deploying to Teams)
- App Studio or Teams Developer Portal (for uploading app manifest)

## Local Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env.local` file based on `.env.local.example` and update it with your API URL.
4. Run the development server:
```bash
npm run dev
```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Teams

### 1. Create a Free Microsoft Developer Account

If you don't have a Microsoft 365 developer account:
1. Go to [Microsoft 365 Developer Program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
2. Sign up for the Microsoft 365 Developer Program
3. Follow the steps to create a developer tenant

### 2. Deploy Your Application

You'll need to host your application on a public URL. There are several options:

#### Option 1: Deploy to Vercel (Easiest)
1. Sign up for [Vercel](https://vercel.com) and connect your GitHub repository
2. Vercel will automatically deploy your app
3. Make note of your application URL (e.g., https://your-app-name.vercel.app)

#### Option 2: Deploy to Azure
1. Create an Azure account if you don't have one
2. Use the Azure Web App service to deploy your Node.js application

### 3. Update App Manifest

1. Open the `teams-app-manifest.json` file
2. Replace all instances of `https://your-app-url.com` with your actual application URL
3. Replace `{{YOUR_MICROSOFT_APP_ID}}` with your Microsoft App ID (you can generate a new GUID using online tools like [guidgenerator.com](https://www.guidgenerator.com/))
4. Add icons for your app in the root directory:
   - `color.png` - 192x192 pixel icon
   - `outline.png` - 32x32 pixel white icon with transparent background

### 4. Create App Package

1. Create a ZIP file containing:
   - `teams-app-manifest.json` (renamed to `manifest.json`)
   - `color.png`
   - `outline.png`

### 5. Upload to Teams

#### Option 1: Using Microsoft Teams Developer Portal (Recommended)
1. Go to [Teams Developer Portal](https://dev.teams.microsoft.com/home)
2. Sign in with your Microsoft account
3. Navigate to Apps > Import app
4. Upload your ZIP file
5. Go to "Test and distribute" and click "Install"

#### Option 2: Upload Directly to Teams
1. In Microsoft Teams, click on "Apps" in the left sidebar
2. Click "Upload a custom app" (you might need to click "More apps" first)
3. Select your ZIP file
4. Follow the installation prompts

### 6. Share With Others (Free Method)

Without publishing to the Microsoft Teams App Store:
1. In Teams Developer Portal, go to your app
2. Under "Test and distribute", download the app package
3. Share this package with your colleagues/users
4. They can install it using the "Upload a custom app" option in Teams

### Common Issues and Troubleshooting

1. **App not loading in Teams:** Check that your app's domain is included in the `validDomains` section of the manifest.
2. **Authentication issues:** Make sure your app is using the proper authentication mechanisms for Teams apps.
3. **CORS errors:** Ensure your backend allows CORS from your Teams domain.

## Project Structure

```
okr-tree/
├── app/                 # Next.js app pages
│   ├── account/         # User account page
│   ├── login/           # Login page
│   ├── my-tasks/        # User's tasks page
│   ├── register/        # Registration page
│   └── TeamsProvider.js # Teams integration
├── components/          # React components
│   ├── ui/              # UI components from shadcn
│   ├── CircularProgress.js # Progress indicator
│   ├── Header.js        # App header
│   ├── ObjectiveDialog.js # Dialog for objectives
│   ├── ObjectiveNode.js # Tree node component
│   ├── TaskDialog.js    # Dialog for tasks
│   └── TaskList.js      # Task list component
├── context/            
│   └── AuthContext.js   # Authentication context
├── lib/
│   ├── teams-client.js  # Teams integration
│   └── utils.js         # Utility functions
├── public/              # Public assets
│   ├── color.png        # Teams app color icon
│   └── outline.png      # Teams app outline icon
├── services/
│   └── api.js           # API service calls
├── .env.local           # Environment variables
├── .env.local.example   # Example environment file
├── teams-app-manifest.json # Teams app manifest
└── README.md            # Documentation
```

## Technologies Used

- **Frontend:**
  - Next.js 14 (React framework)
  - Tailwind CSS (Styling)
  - Shadcn UI (Component library)
  - Microsoft Teams JS SDK

- **Backend:**
  - Existing API at https://okr-tree-app-backend.onrender.com/api/v1

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT

## Support

For support, please open an issue on the GitHub repository.
