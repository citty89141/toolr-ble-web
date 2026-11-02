// Injected by web/build_site.mjs into the pages that come from other repos (eBike Tool, the analyzer, ToolB OTA):
// a small button back to the integrated site's home page. The pages themselves are not changed otherwise.
(() => {
  const a = document.createElement("a");
  a.href = "../";
  a.title = "ToolR 工具首頁";
  a.setAttribute("aria-label", "ToolR 工具首頁");
  a.textContent = "⌂";
  a.style.cssText = [
    "position:fixed", "right:12px", "bottom:calc(12px + env(safe-area-inset-bottom))", "z-index:2147483000",
    "width:36px", "height:36px", "border-radius:50%", "display:flex", "align-items:center", "justify-content:center",
    "background:#1f6feb", "color:#fff", "font:20px/1 system-ui,sans-serif", "text-decoration:none",
    "box-shadow:0 2px 6px rgba(0,0,0,.35)", "opacity:.85",
  ].join(";");
  document.body.append(a);
})();
