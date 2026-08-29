// Execute the auto-login logic
function attemptAutoLogin() {
  const currentUrl = window.location.href;

  // 1. If we are on the main page, find the "Log in" link and click it
  if (currentUrl === 'https://moovit.vit.ac.in/' || currentUrl === 'https://moovit.vit.ac.in') {
    const loginLinks = Array.from(document.querySelectorAll('a')).filter(
      a => a.href.includes('/login/index.php') || a.textContent.toLowerCase().includes('log in')
    );

    if (loginLinks.length > 0) {
      console.log('Moovit Auto-Login: Navigating to login page...');
      loginLinks[0].click();
    }
    return;
  }

  // 2. If we are on the login page, attempt to fill credentials and submit
  if (currentUrl.includes('/login/index.php')) {
    chrome.storage.local.get(['accounts', 'activeAccount'], (result) => {
      const activeAccountUsername = result.activeAccount;
      const accounts = result.accounts || [];

      if (!activeAccountUsername) {
        console.log('Moovit Auto-Login: No active account set.');
        return;
      }

      const activeAccount = accounts.find(a => a.username === activeAccountUsername);

      if (!activeAccount) {
        console.log('Moovit Auto-Login: Active account not found in storage.');
        return;
      }

      // Standard Moodle Selectors
      const usernameField = document.getElementById('username') || document.querySelector('input[name="username"]');
      const passwordField = document.getElementById('password') || document.querySelector('input[name="password"]');
      const loginBtn = document.getElementById('loginbtn') || document.querySelector('button[type="submit"]');

      if (usernameField && passwordField) {
        console.log(`Moovit Auto-Login: Attempting login for ${activeAccount.username}...`);

        // Fill fields
        usernameField.value = activeAccount.username;
        passwordField.value = activeAccount.password;

        // Dispatch events so React/Vue/Moodle internal scripts register the change
        usernameField.dispatchEvent(new Event('input', { bubbles: true }));
        passwordField.dispatchEvent(new Event('input', { bubbles: true }));
        usernameField.dispatchEvent(new Event('change', { bubbles: true }));
        passwordField.dispatchEvent(new Event('change', { bubbles: true }));

        // Immediate submission as requested by the user
        if (loginBtn) {
          loginBtn.click();
        } else {
          // Fallback if button doesn't have standard selector
          const form = usernameField.closest('form');
          if (form) form.submit();
        }
      }
    });
  }
}

// Run immediately when the script is injected
attemptAutoLogin();

// In case it's a SPA or elements load asynchronously, use a lightweight MutationObserver as a fallback
const observer = new MutationObserver((mutations, obs) => {
  const usernameField = document.getElementById('username') || document.querySelector('input[name="username"]');
  if (usernameField) {
    obs.disconnect(); // Stop observing once we found the form
    attemptAutoLogin();
  }
});

if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
}
