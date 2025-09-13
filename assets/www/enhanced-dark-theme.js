// Enhanced Dark Theme Toggle Functionality
(function() {
  // Function to initialize the theme toggle
  function initThemeToggle() {
    console.log('Initializing dark theme toggle...');
    
    // Create and insert the theme toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.innerHTML = '<ion-icon name="moon"></ion-icon>';
    toggleBtn.setAttribute('id', 'theme-toggle');
    
    // Add some inline styles to ensure visibility
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.top = '10px';
    toggleBtn.style.right = '10px';
    toggleBtn.style.zIndex = '9999';
    toggleBtn.style.width = '40px';
    toggleBtn.style.height = '40px';
    toggleBtn.style.borderRadius = '50%';
    toggleBtn.style.backgroundColor = '#f44336';
    toggleBtn.style.color = 'white';
    toggleBtn.style.border = 'none';
    toggleBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    toggleBtn.style.display = 'flex';
    toggleBtn.style.alignItems = 'center';
    toggleBtn.style.justifyContent = 'center';
    
    // Add the button to the DOM
    document.body.appendChild(toggleBtn);
    console.log('Theme toggle button added to DOM');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('qms-theme');
    console.log('Saved theme preference:', savedTheme);
    
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      toggleBtn.innerHTML = '<ion-icon name="sunny"></ion-icon>';
      console.log('Dark theme applied from saved preference');
    }
    
    // Add click event to toggle theme
    toggleBtn.addEventListener('click', function() {
      console.log('Theme toggle clicked');
      document.body.classList.toggle('dark-theme');
      
      if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('qms-theme', 'dark');
        toggleBtn.innerHTML = '<ion-icon name="sunny"></ion-icon>';
        console.log('Dark theme enabled');
      } else {
        localStorage.setItem('qms-theme', 'light');
        toggleBtn.innerHTML = '<ion-icon name="moon"></ion-icon>';
        console.log('Light theme enabled');
      }
    });
  }
  
  // Function to apply dark theme CSS directly
  function applyDarkThemeStyles() {
    console.log('Applying dark theme styles directly...');
    
    // Create a style element for the dark theme
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      /* Dark Theme Variables */
      .dark-theme {
        --ion-background-color: #121212 !important;
        --ion-text-color: #ffffff !important;
        --ion-border-color: #333333 !important;
        --ion-item-background: #1e1e1e !important;
        --ion-toolbar-background: #1e1e1e !important;
        --ion-card-background: #1e1e1e !important;
      }
      
      /* Theme Toggle Button */
      .theme-toggle {
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #f44336;
        color: white;
        border: none;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      /* Dark Theme Styles */
      .dark-theme {
        background-color: #121212 !important;
        color: #ffffff !important;
      }
      
      .dark-theme ion-content {
        --background: #121212 !important;
        --color: #ffffff !important;
      }
      
      .dark-theme ion-card {
        background: #1e1e1e !important;
        color: #ffffff !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        border: 1px solid #333333 !important;
      }
      
      .dark-theme ion-card-header {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        color: white !important;
      }
      
      .dark-theme ion-item {
        --background: #1e1e1e !important;
        --border-color: #333333 !important;
        --color: #ffffff !important;
      }
      
      .dark-theme ion-label {
        color: #ffffff !important;
      }
      
      .dark-theme .text-primary {
        color: #f5574b !important;
      }
      
      .dark-theme ion-toolbar {
        --background: #1e1e1e !important;
        --color: #ffffff !important;
      }
      
      /* QMS Queue Card Styles */
      .dark-theme page-queue-list .qcard {
        background: #1e1e1e !important;
        box-shadow: 0 4px 10px rgba(247, 112, 102, 0.1) !important;
      }
      
      .dark-theme page-queue-list .qcard ion-card-header {
        background-color: #f44336 !important;
        color: white !important;
      }
    `;
    
    // Add the style element to the head
    document.head.appendChild(styleEl);
    console.log('Dark theme styles added to head');
  }
  
  // Function to wait for the DOM to be ready
  function waitForDOM() {
    if (document.body) {
      console.log('DOM is ready, initializing dark theme');
      applyDarkThemeStyles();
      initThemeToggle();
    } else {
      console.log('DOM not ready, waiting...');
      setTimeout(waitForDOM, 300);
    }
  }
  
  // Start the initialization process
  console.log('Dark theme script loaded');
  
  // Try both methods of attaching to DOM ready events
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('DOMContentLoaded event fired');
      waitForDOM();
    });
  } else {
    console.log('Document already loaded');
    waitForDOM();
  }
  
  // Also try with a timeout as a fallback
  setTimeout(function() {
    console.log('Timeout fallback for dark theme initialization');
    waitForDOM();
  }, 1000);
  
  // Handle the case of Ionic's delayed initialization
  document.addEventListener('ionicBootstrap', function() {
    console.log('Ionic bootstrap event detected');
    waitForDOM();
  });
})();
