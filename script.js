    // Wrap everything inside DOMContentLoaded so elements are ready
    document.addEventListener('DOMContentLoaded', () => {
      const grid = document.getElementById('emojiGrid');
      let emojis = JSON.parse(localStorage.getItem('emojiList') || '[]');
      let contextMenuDiv = null;

      function closeContextMenu() {
        if (contextMenuDiv) {
          contextMenuDiv.remove();
          contextMenuDiv = null;
        }
      }

      function renderEmojis() {
        grid.innerHTML = '';
        emojis.forEach(({ title, url }, index) => {
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

        div.onclick = () => {
          navigator.clipboard.writeText(url).then(() => {
            copiedMsg.classList.add('show');
            setTimeout(() => {
              copiedMsg.classList.remove('show');
            }, 1000);
          }).catch((err) => {
            const success = fallbackCopyTextToClipboard(url);
            if (success) {
              copiedMsg.classList.add('show');
              setTimeout(() => {
                copiedMsg.classList.remove('show');
              }, 1000);
            } else {
              alert('Clipboard copy failed: ' + err + '\n\nCopy manually:\n' + url);
            }
          });
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
                renderEmojis();
              }
              closeContextMenu();
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => {
              emojis.splice(index, 1);
              renderEmojis();
              closeContextMenu();
            };

            contextMenuDiv.appendChild(editBtn);
            contextMenuDiv.appendChild(deleteBtn);
            document.body.appendChild(contextMenuDiv);

            const menuWidth = 100; // fixed width from CSS
            const menuHeight = contextMenuDiv.offsetHeight || 60; // approx 2 buttons

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

      // Close context menu if clicking outside
      document.addEventListener('click', (e) => {
        if (contextMenuDiv && !contextMenuDiv.contains(e.target)) {
          closeContextMenu();
        }
      });

      // Close context menu on Escape key press
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeContextMenu();
        }
      });

    function fallbackCopyTextToClipboard(text) {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          // Avoid scrolling to bottom
          textArea.style.position = "fixed";
          textArea.style.top = "-9999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
        
          let successful = false;
          try {
            successful = document.execCommand('copy');
          } catch (err) {
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
        renderEmojis();
        document.getElementById('titleInput').value = '';
        document.getElementById('urlInput').value = '';
      }

      function exportData() {
        const blob = new Blob([JSON.stringify(emojis, null, 2)], {
          type: 'application/json',
        });
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
            renderEmojis();
          } catch {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }

      // Attach event listeners to buttons and input
      document.getElementById('addBtn').addEventListener('click', addEmoji);
      document.getElementById('exportBtn').addEventListener('click', exportData);
      document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
      });
      document.getElementById('importFile').addEventListener('change', importFile);

      renderEmojis();
    });
