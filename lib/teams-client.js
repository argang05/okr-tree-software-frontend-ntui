"use client";

import * as microsoftTeams from "@microsoft/teams-js";

// Check if we're in a Teams environment
function isTeamsEnvironment() {
  try {
    // Check if we're in an iframe, which is likely the case in Teams
    if (window.self !== window.top) {
      return true;
    }
    // Additional check for Teams app context
    return window.parent !== window && !!window.microsoftTeams;
  } catch (e) {
    // If we get a security error accessing window.parent, we might be in Teams with cross-origin restrictions
    return true; 
  }
}

// Initialize the Microsoft Teams SDK
export function initializeTeamsContext() {
  try {
    // Only try to initialize if we're likely in a Teams environment
    if (isTeamsEnvironment()) {
      microsoftTeams.app.initialize();
      console.log("Microsoft Teams SDK initialized");
      return true;
    } else {
      console.log("Not running in Teams environment, skipping initialization");
      return false;
    }
  } catch (error) {
    console.error("Error initializing Microsoft Teams SDK:", error);
    return false;
  }
}

// Get the current Teams context
export async function getTeamsContext() {
  try {
    // First check if we're in Teams
    if (!isTeamsEnvironment()) {
      console.log("Not in Teams environment, cannot get context");
      return null;
    }
    
    const context = await microsoftTeams.app.getContext();
    return context;
  } catch (error) {
    console.error("Error getting Teams context:", error);
    return null;
  }
}

// Notify Teams of theme change
export function registerTeamsThemeChangeHandler(handler) {
  try {
    if (!isTeamsEnvironment()) return;
    microsoftTeams.app.registerOnThemeChangeHandler(handler);
  } catch (error) {
    console.error("Error registering theme change handler:", error);
  }
}

// Handle authentication
export function authenticate() {
  try {
    if (!isTeamsEnvironment()) return;
    microsoftTeams.authentication.getAuthToken({
      successCallback: (token) => {
        // Here you would validate the token with your backend
        console.log("Authentication successful");
      },
      failureCallback: (error) => {
        console.error("Authentication failed:", error);
      },
    });
  } catch (error) {
    console.error("Error authenticating with Teams:", error);
  }
}

// Check if app is running in Teams
export function isRunningInTeams() {
  try {
    return isTeamsEnvironment() && microsoftTeams.app.isInitialized();
  } catch (error) {
    console.error("Error checking if running in Teams:", error);
    return false;
  }
}

// Register to get notified if the user changes color theme
export function setTeamsTheme() {
  try {
    if (!isTeamsEnvironment()) return;
    const context = microsoftTeams.app.getContext();
    context.then((ctx) => {
      const theme = ctx.app.theme;
      document.body.className = theme === "dark" ? "dark" : "";
    });
  } catch (error) {
    console.error("Error setting Teams theme:", error);
  }
}

// Open a dialog
export function openDialog(url, title, width, height) {
  try {
    if (!isTeamsEnvironment()) {
      // For non-Teams environment, open in a new window/tab
      window.open(url, "_blank");
      return;
    }
    microsoftTeams.dialog.open({
      title: title,
      url: url,
      width: width,
      height: height,
    });
  } catch (error) {
    console.error("Error opening dialog:", error);
    // Fallback to regular window.open
    window.open(url, "_blank");
  }
}

// Share content
export function shareContent(content) {
  try {
    if (!isTeamsEnvironment()) return;
    microsoftTeams.sharing.shareWebContent({
      content: [
        {
          type: "link",
          url: content.url,
          message: content.message,
          preview: true,
        },
      ],
    });
  } catch (error) {
    console.error("Error sharing content:", error);
  }
} 