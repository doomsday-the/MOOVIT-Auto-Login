# Moovit Auto-Login Chrome Extension

A sleek, lightweight Chrome Extension designed to automate the login process for `moovit.vit.ac.in` (VIT Vellore's Moodle Infrastructure). This extension securely manages your credentials locally and supports fast switching between multiple accounts.

## ✨ Features
- **Instant Auto-Login**: Automatically clicks "Log in" on the homepage and instantly submits your credentials on the login page.
- **Multi-Account Support**: Add and manage multiple registration numbers. Easily switch which account is currently active.
- **Secure Local Storage**: Uses Chrome's `chrome.storage.local` API to keep your credentials stored safely inside your browser, not hardcoded in scripts.
- **Premium Dark UI**: Features a modern, dark-themed popup interface tailored for aesthetics and ease of use.
- **Reliable Form Filling**: Uses native value setters to bypass restrictive frontend frameworks, ensuring your credentials are typed in flawlessly every time.

## 🚀 Installation (Developer Mode)

Since this is a custom extension, you will need to load it locally into Chrome:

1. Download or clone this repository to your computer (e.g., to a folder named `MOOVIT`).
2. Open Google Chrome and navigate to `chrome://extensions/` in the URL bar.
3. In the top right corner, toggle the **Developer mode** switch to ON.
4. In the top left corner, click **Load unpacked**.
5. Select the `MOOVIT` folder that contains the `manifest.json` file.
6. The extension is now installed! Click the puzzle piece icon 🧩 next to your Chrome profile picture and click the pin icon next to "Moovit Auto-Login" so it's always accessible.

## 🛠️ Usage

1. **Add an Account**: Click the extension icon in your toolbar to open the popup. Enter your Registration Number (e.g., `24bce0837`) and Password, then click **Save Account**.
2. **Set Active Account**: If you have multiple accounts saved, simply click on the one you want to use to mark it as **Active**.
3. **Log In**: Visit [moovit.vit.ac.in](https://moovit.vit.ac.in). The extension will automatically detect the page and log you in.

## 📂 File Structure
- `manifest.json`: Configuration and metadata for the extension.
- `popup.html` & `popup.css`: Structure and styling for the extension's user interface.
- `popup.js`: Manages the logic for saving, deleting, and switching accounts.
- `content.js`: The script that runs on the Moovit website to perform the automated DOM interactions.

## ⚠️ Disclaimer
This extension was created for personal convenience and educational purposes to streamline the login workflow for students.
