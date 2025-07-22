document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('emojiGrid');
  const searchInput = document.getElementById('searchInput');
  let emojis = JSON.parse(localStorage.getItem('emojiList') || '[]');
  let autosendEnabled = localStorage.getItem('autosendEnabled') === 'true';
  let contextMenuDiv = null;
  let dragSrcIndex = null;
  let placeholder = null;

  // Close context menu helper
  function closeContextMenu() {
    if (contextMenuDiv) {
      contextMenuDiv.remove();
      contextMenuDiv = null;
    }
  }

  // Autosend toggle setup
  const autosendToggle = document.getElementById('autosendToggle');
  if (autosendToggle) {
    autosendToggle.checked = autosendEnabled;
    autosendToggle.addEventListener('change', () => {
      autosendEnabled = autosendToggle.checked;
      localStorage.setItem('autosendEnabled', autosendEnabled);
    });
  }

  // Render emojis with optional search filter
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

      // Drag start event
      div.addEventListener('dragstart', (e) => {
        dragSrcIndex = index;
        e.dataTransfer.effectAllowed = 'move';

        // Transparent drag image to hide default ghost
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

      // Drag end event
      div.addEventListener('dragend', () => {
        if (placeholder) placeholder.remove();
        placeholder = null;
        div.classList.remove('dragging');
        dragSrcIndex = null;
      });

      // Click to copy or autosend
      div.onclick = () => {
        if (autosendEnabled) {
          window.parent.postMessage({
            type: 'insertEmojiUrl',
            url: url,
          }, '*');
        } else {
          navigator.clipboard.writeText(url).then(() => {
            copiedMsg.classList.add('show');
            setTimeout(() => copiedMsg.classList.remove('show'), 1000);
          }).catch(() => {
            if (fallbackCopyTextToClipboard(url)) {
              copiedMsg.classList.add('show');
              setTimeout(() => copiedMsg.classList.remove('show'), 1000);
            } else {
              alert('Failed to copy URL, please copy manually:\n' + url);
            }
          });
        }
      };

      // Context menu for edit/delete
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

  // Dragover event on grid to move placeholder depending on mouse position
  grid.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!placeholder) return;
  
    const mouseY = e.clientY;
    const allChildren = Array.from(grid.children).filter(el => !el.classList.contains('placeholder'));
  
    let insertBeforeNode = null;
  
    for (let i = 0; i < allChildren.length; i++) {
      const child = allChildren[i];
      const rect = child.getBoundingClientRect();
  
      if (mouseY < rect.top + rect.height / 2) {
        insertBeforeNode = child;
        break;
      }
    }
  
    if (insertBeforeNode) {
      if (placeholder.nextSibling !== insertBeforeNode) {
        grid.insertBefore(placeholder, insertBeforeNode);
      }
    } else {
      grid.appendChild(placeholder);
    }
  });

  // Drop event on grid to reorder emojis array and re-render
  grid.addEventListener('drop', (e) => {
    e.preventDefault();
    if (dragSrcIndex === null || !placeholder) return;

    const allChildren = Array.from(grid.children);
    const placeholderIndex = allChildren.indexOf(placeholder);

    // Emoji divs excluding placeholder
    const emojiElements = allChildren.filter(el => !el.classList.contains('placeholder'));

    let newIndex = 0;
    for (let i = 0; i < emojiElements.length; i++) {
      if (allChildren.indexOf(emojiElements[i]) < placeholderIndex) {
        newIndex++;
      } else {
        break;
      }
    }

    // Move emoji in data array
    const movedEmoji = emojis.splice(dragSrcIndex, 1)[0];
    emojis.splice(newIndex, 0, movedEmoji);

    // Cleanup
    dragSrcIndex = null;
    placeholder.remove();
    placeholder = null;

    // Re-render and save
    renderEmojis(searchInput.value);
  });

  // Close context menu on outside click
  document.addEventListener('click', (e) => {
    if (contextMenuDiv && !contextMenuDiv.contains(e.target)) {
      closeContextMenu();
    }
  });

  // Close context menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeContextMenu();
  });

  // Fallback copy to clipboard method
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

  // Add emoji from inputs
  function addEmoji() {
    const title = document.getElementById('titleInput').value.trim();
    const url = document.getElementById('urlInput').value.trim();
    if (!url) return alert('Image URL is required');
    emojis.push({ title, url });
    renderEmojis(searchInput.value);
    document.getElementById('titleInput').value = '';
    document.getElementById('urlInput').value = '';
  }

  // Export emoji list JSON
  function exportData() {
    const blob = new Blob([JSON.stringify(emojis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emojis.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import emojis JSON from file
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

  // Event listeners for buttons and inputs
  document.getElementById('addBtn').addEventListener('click', addEmoji);
  document.getElementById('exportBtn').addEventListener('click', exportData);
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', importFile);

  searchInput.addEventListener('input', () => renderEmojis(searchInput.value));

  // Initial render
  renderEmojis();
});
