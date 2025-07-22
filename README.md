# Discord Custom Emoji Sidebar

A Chrome extension that injects a customizable emoji sidebar into Discord. Easily add, remove, edit, drag-and-drop reorder your custom emojis and share your emoji packs!

---

## Installation Instructions

1. **Download the ZIP**  
   Download the zipped extension folder to your computer.

2. **Unpack the ZIP**  
   Extract/unzip the downloaded file. You should get a folder containing all the extension files (`manifest.json`, `content.js`, `main.html`, icons, etc.).

3. **Open Chrome Extensions Page**  
   Open Chrome and navigate to: `chrome://extensions/`

4. **Enable Developer Mode**  
   Toggle the **Developer mode** switch in the top-right corner of the page to ON.

5. **Load the Unpacked Extension**  
   Click the **Load unpacked** button.

6. **Select the Extension Folder**  
   In the dialog, select the **folder that contains the extension files directly** — **NOT** a folder containing another folder of files.  
   This should be the bottom-level folder that has files like `manifest.json`, `content.js`, and `main.html` inside it.

7. **Confirm the Extension Loads**  
   After selecting the correct folder, the extension should appear enabled in your extensions list.

8. **Reload Discord**  
   Open Discord in Chrome (or reload the page if it’s already open) to see the emoji sidebar injected.

---

## Usage Instructions

### Adding Emojis

- Use the input fields at the bottom to enter a **Title** and an **Image URL** for your emoji.
- Click **Add Image** to add it to the sidebar.
- The emoji will appear immediately in the grid.

### Editing Emojis

- **Right-click** an emoji to open the context menu.
- Click **Edit**.
- Enter a new title and/or image URL when prompted.
- The changes will update immediately.

### Deleting Emojis

- **Right-click** an emoji.
- Click **Delete** in the context menu.
- The emoji will be removed immediately.

### Reordering Emojis

- Click and drag an emoji to reorder it in the sidebar.
- When dragging, a placeholder will show where the emoji will be dropped.
- Release to drop and save the new order.
- **Note:** Drag-and-drop mostly works smoothly but may occasionally feel a bit glitchy or finicky depending on your browser and Discord layout.

### Auto-Send Toggle

- Use the **Auto-Send** toggle checkbox to enable or disable auto-sending emoji URLs to Discord.
- When enabled, clicking an emoji sends its URL to Discord automatically.
- When disabled, clicking an emoji copies its URL to your clipboard.

---

## Importing and Exporting Emoji Packs

### Export

- Click the **Export** button to download your emoji list as a JSON file.
- This file contains all your emojis with titles and URLs.

### Import

- Click the **Import** button and select a previously exported JSON file.
- Your emoji list will be replaced with the emojis in the file.
- Make sure the file is valid JSON formatted for this extension.

---

## Notes

- Your emoji list and settings (like Auto-Send toggle) are saved locally in your browser’s `localStorage`.
- You can customize your emoji sidebar to your liking and keep your packs synced locally.
- Drag-and-drop reordering sometimes may feel a little glitchy but usually works well.
- Make sure to reload Discord after loading or reloading the extension to see changes.

---

Enjoy your personalized Discord emoji sidebar! If you run into any issues or want to request features, feel free to reach out.
