document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-account-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const accountList = document.getElementById('account-list');
  const noAccountsMsg = document.getElementById('no-accounts-msg');

  // Load existing accounts
  loadAccounts();

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username && password) {
      addAccount(username, password);
      form.reset();
    }
  });

  function loadAccounts() {
    chrome.storage.local.get(['accounts', 'activeAccount'], (result) => {
      const accounts = result.accounts || [];
      const activeAccount = result.activeAccount || null;
      renderAccounts(accounts, activeAccount);
    });
  }

  function renderAccounts(accounts, activeAccount) {
    accountList.innerHTML = '';
    
    if (accounts.length === 0) {
      noAccountsMsg.style.display = 'block';
      accountList.style.display = 'none';
      return;
    }

    noAccountsMsg.style.display = 'none';
    accountList.style.display = 'block';

    accounts.forEach((acc, index) => {
      const isActive = activeAccount === acc.username;
      const li = document.createElement('li');
      li.className = `account-item ${isActive ? 'active' : ''}`;
      
      li.innerHTML = `
        <div class="account-info">
          <span class="account-username">${acc.username}</span>
          <span class="account-status">${isActive ? 'Active for Auto-Login' : 'Click to set active'}</span>
        </div>
        <button class="delete-btn" data-index="${index}" title="Delete account">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      `;

      // Set active on click
      li.querySelector('.account-info').addEventListener('click', () => {
        setActiveAccount(acc.username);
      });

      // Delete on click
      li.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteAccount(index);
      });

      accountList.appendChild(li);
    });
  }

  function addAccount(username, password) {
    chrome.storage.local.get(['accounts'], (result) => {
      let accounts = result.accounts || [];
      
      // Check if account already exists
      const existingIndex = accounts.findIndex(a => a.username === username);
      if (existingIndex >= 0) {
        accounts[existingIndex].password = password; // Update password
      } else {
        accounts.push({ username, password });
      }

      // If it's the first account, make it active by default
      if (accounts.length === 1) {
        chrome.storage.local.set({ activeAccount: username });
      }

      chrome.storage.local.set({ accounts }, () => {
        loadAccounts();
      });
    });
  }

  function setActiveAccount(username) {
    chrome.storage.local.set({ activeAccount: username }, () => {
      loadAccounts();
    });
  }

  function deleteAccount(index) {
    chrome.storage.local.get(['accounts', 'activeAccount'], (result) => {
      let accounts = result.accounts || [];
      const activeAccount = result.activeAccount;
      
      const deletedUsername = accounts[index].username;
      accounts.splice(index, 1);

      const updates = { accounts };

      // If we deleted the active account, reset it or set to another one
      if (activeAccount === deletedUsername) {
        updates.activeAccount = accounts.length > 0 ? accounts[0].username : null;
      }

      chrome.storage.local.set(updates, () => {
        loadAccounts();
      });
    });
  }
});
