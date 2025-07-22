document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('emojiGrid');
  const searchInput = document.getElementById('searchInput');
  let emojis = JSON.parse(localStorage.getItem('emojiList') || '[]');
  let autosendEnabled = localStorage.getItem('autosendEnabled') === 'true';
  let contextMenuDiv = null;
  let dragSrcIndex = null;
  let placeholder = null;

  function closeContextMenu() {
    if (contextMenuDiv) {
      contextMenuDiv.remove();
      contextMenuDiv = null;
    }
  }

  const autosendToggle = document.getElementById('autosendToggle');
  if (autosendToggle) {
    autosendToggle.checked = autosendEnabled;
    autosendToggle.addEventListener('change', () => {
      autosendEnabled = autosendToggle.checked;
      localStorage.setItem('autosendEnabled', autosendEnabled);
    });
  }

  
  function renderEmojis(filter = '') {
    grid.innerHTML = '';
    const filtered = emojis.filter(({ title }) =>
      title.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(({ title, url }, index) => {
      const div = document.createElement('div');
      div.className = 'emoji';
      div.title = title;

      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.innerText = title;

      const img = document.createElement('img');
      img.src = url;

      const copiedMsg = document.createElement('div');
      copiedMsg.className = 'copied-message';
      copiedMsg.innerText = 'Copied!';

      
      div.appendChild(img);
      div.appendChild(tooltip);
      div.appendChild(copiedMsg);

      div.draggable = true;
      
      div.addEventListener('dragstart', (e) => {
        dragSrcIndex = index;
        e.dataTransfer.effectAllowed = 'move';
        // Create a transparent drag image to avoid default ghost
        const crt = document.createElement('canvas');
        crt.width = crt.height = 0;
        e.dataTransfer.setDragImage(crt, 0, 0);
      
        // Create and insert placeholder
        placeholder = document.createElement('div');
        placeholder.className = 'emoji placeholder';
        placeholder.style.height = div.offsetHeight + 'px';
        grid.insertBefore(placeholder, div.nextSibling);
      
        div.classList.add('dragging');
      });
      
      div.addEventListener('dragend', (e) => {
        if (placeholder) placeholder.remove();
        placeholder = null;
      
        div.classList.remove('dragging');
      
        // If dragSrcIndex changed, save emojis
        if (dragSrcIndex !== null) {
          localStorage.setItem('emojiList', JSON.stringify(emojis));
        }
        dragSrcIndex = null;
      });
      
      div.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!placeholder) return;
        const bounding = div.getBoundingClientRect();
        const offset = e.clientY - bounding.top;
      
        const insertBefore = offset < bounding.height / 2;
      
        if (insertBefore) {
          if (grid.contains(placeholder) && placeholder.nextSibling !== div) {
            grid.insertBefore(placeholder, div);
          }
        } else {
          if (grid.contains(placeholder) && placeholder.nextSibling !== div.nextSibling) {
            grid.insertBefore(placeholder, div.nextSibling);
          }
        }
      });
      
      grid.addEventListener('drop', (e) => {
        e.preventDefault();
        if (dragSrcIndex === null || !placeholder) return;
      
        const newChildren = Array.from(grid.children).filter(c => !c.classList.contains('placeholder'));
        const newIndex = newChildren.indexOf(placeholder);
      
        // Remove dragged emoji and insert at new index
        const moved = emojis.splice(dragSrcIndex, 1)[0];
        emojis.splice(newIndex, 0, moved);
      
        dragSrcIndex = null;
        placeholder.remove();
        placeholder = null;
      
        renderEmojis(searchInput.value);
      });

      
      div.onclick = () => {
        const autoSend = autosendEnabled;
      
        if (autoSend) {
          // Post message to parent page
          window.parent.postMessage({
            type: 'insertEmojiUrl',
            url: url
          }, '*'); // You can restrict target origin if needed
        } else {
          navigator.clipboard.writeText(url).then(() => {
            copiedMsg.classList.add('show');
            setTimeout(() => copiedMsg.classList.remove('show'), 1000);
          }).catch((err) => {
            const success = fallbackCopyTextToClipboard(url);
            if (success) {
              copiedMsg.classList.add('show');
              setTimeout(() => copiedMsg.classList.remove('show'), 1000);
            } else {
              alert('Clipboard copy failed: ' + err + '\n\nCopy manually:\n' + url);
            }
          });
        }
      };


      div.oncontextmenu = (e) => {
        e.preventDefault();
        closeContextMenu();

        contextMenuDiv = document.createElement('div');
        contextMenuDiv.className = 'custom-context-menu';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => {
          const newTitle = prompt('New title:', title);
          const newUrl = prompt('New image URL:', url);
          if (newTitle && newUrl) {
            emojis[index] = { title: newTitle, url: newUrl };
            renderEmojis(searchInput.value);
          }
          closeContextMenu();
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => {
          emojis.splice(index, 1);
          renderEmojis(searchInput.value);
          closeContextMenu();
        };

        contextMenuDiv.appendChild(editBtn);
        contextMenuDiv.appendChild(deleteBtn);
        document.body.appendChild(contextMenuDiv);

        const menuWidth = 100;
        const menuHeight = contextMenuDiv.offsetHeight || 60;

        let left = e.pageX;
        let top = e.pageY;

        if (left + menuWidth > window.innerWidth) {
          left = window.innerWidth - menuWidth - 10;
        }
        if (top + menuHeight > window.innerHeight) {
          top = window.innerHeight - menuHeight - 10;
        }

        contextMenuDiv.style.left = left + 'px';
        contextMenuDiv.style.top = top + 'px';
      };

      grid.appendChild(div);
    });

    localStorage.setItem('emojiList', JSON.stringify(emojis));
  }

  document.addEventListener('click', (e) => {
    if (contextMenuDiv && !contextMenuDiv.contains(e.target)) {
      closeContextMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeContextMenu();
  });

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch {
      successful = false;
    }
    document.body.removeChild(textArea);
    return successful;
  }

  function addEmoji() {
    const title = document.getElementById('titleInput').value.trim();
    const url = document.getElementById('urlInput').value.trim();
    if (!url) return alert('Image URL is required');
    emojis.push({ title, url });
    renderEmojis(searchInput.value);
    document.getElementById('titleInput').value = '';
    document.getElementById('urlInput').value = '';
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(emojis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emojis.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        emojis = JSON.parse(e.target.result);
        renderEmojis(searchInput.value);
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  }

  document.getElementById('addBtn').addEventListener('click', addEmoji);
  document.getElementById('exportBtn').addEventListener('click', exportData);
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', importFile);

  searchInput.addEventListener('input', () => renderEmojis(searchInput.value));

  renderEmojis();
});
