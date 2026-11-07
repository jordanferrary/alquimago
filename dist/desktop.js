document.querySelector('#close').addEventListener('click', () => {
  window.__TAURI__?.window?.getCurrentWindow()?.close?.();
});
