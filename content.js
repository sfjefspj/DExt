(() => {
  if (window.__emojiSidebarInjected) return;
  window.__emojiSidebarInjected = true;

  const GITHUB_URL = 'https://raw.githubusercontent.com/sfjefspj/DiscordCustomEmojis/refs/heads/main/main.html';

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
    display: 'none',
    flexDirection: 'column',
    overflow: 'hidden',
    resize: 'horizontal',
    minWidth: '150px',
    maxWidth: '80vw'
  });

  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    border: 'none',
    width: '100%',
    flex: '1'
  });
  sidebar.appendChild(iframe);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    zIndex: 1000001
  });
  closeBtn.title = 'Close Sidebar';
  closeBtn.onclick = () => {
    sidebar.remove();
    restoreBtn.style.display = 'block';
    window.__emojiSidebarInjected = false;
  };
  sidebar.appendChild(closeBtn);

  const minimizeBtn = document.createElement('button');
  minimizeBtn.textContent = '–';
  Object.assign(minimizeBtn.style, {
    position: 'absolute',
    top: '8px',
    right: '38px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    zIndex: 1000001
  });
  minimizeBtn.title = 'Minimize Sidebar';
  minimizeBtn.onclick = () => {
    sidebar.style.display = 'none';
    restoreBtn.style.display = 'block';
  };
  sidebar.appendChild(minimizeBtn);

  const restoreBtn = document.createElement('button');
  restoreBtn.textContent = '▶';
  Object.assign(restoreBtn.style, {
    position: 'fixed',
    top: '10px',
    left: '10px',
    width: '28px',
    height: '28px',
    backgroundColor: '#5865f2',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '26px',
    padding: '0',
    zIndex: 1000000,
    display: 'block'
  });
  restoreBtn.title = 'Restore Sidebar';
  restoreBtn.onclick = () => {
    sidebar.style.display = 'flex';
    restoreBtn.style.display = 'none';
  };
  document.body.appendChild(restoreBtn);
  document.body.appendChild(sidebar);

  fetch(GITHUB_URL)
    .then(res => res.text())
    .then(html => {
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
    })
    .catch(err => {
      alert('Failed to load sidebar HTML: ' + err);
      console.error(err);
    });
})();
