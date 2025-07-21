(() => {
  if (window.__emojiSidebarInjected) return;
  window.__emojiSidebarInjected = true;

  const sidebar = document.createElement('div');
  Object.assign(sidebar.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '400px',
    height: '100vh',
    backgroundColor: '#2b2d31',
    zIndex: 999999,
    boxShadow: '2px 0 10px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    resize: 'horizontal',
    minWidth: '150px',
    maxWidth: '80vw',
  });

  // iframe loading local main.html in the extension
  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    border: 'none',
    width: '100%',
    flex: '1',
  });
  iframe.src = chrome.runtime.getURL('main.html');

  sidebar.appendChild(iframe);

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '15px',
    cursor: 'pointer',
    zIndex: 1000001,
  });
  closeBtn.title = 'Close Sidebar';
  closeBtn.onclick = () => {
    sidebar.remove();
    restoreBtn.style.display = 'block';
    window.__emojiSidebarInjected = false;
  };
  sidebar.appendChild(closeBtn);

  // Minimize button
  const minimizeBtn = document.createElement('button');
  minimizeBtn.textContent = '–';
  Object.assign(minimizeBtn.style, {
    position: 'absolute',
    top: '8px',
    right: '38px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '17px',
    cursor: 'pointer',
    zIndex: 1000001,
  });
  minimizeBtn.title = 'Minimize Sidebar';
  minimizeBtn.onclick = () => {
    sidebar.style.display = 'none';
    restoreBtn.style.display = 'block';
  };
  sidebar.appendChild(minimizeBtn);

  // Restore button
  const restoreBtn = document.createElement('button');
  restoreBtn.textContent = '▶';
  Object.assign(restoreBtn.style, {
    position: 'fixed',
    top: '10px',
    left: '10px',
    width: '20px',
    height: '20px',
    backgroundColor: '#5865f2',
    border: 'none',
    borderRadius: '3px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px',
    lineHeight: '20px',
    padding: '0',
    zIndex: 1000000,
    display: 'none',
  });
  restoreBtn.title = 'Restore Sidebar';
  restoreBtn.onclick = () => {
    sidebar.style.display = 'flex';
    restoreBtn.style.display = 'none';
  };
  document.body.appendChild(restoreBtn);

  document.body.appendChild(sidebar);
})();
