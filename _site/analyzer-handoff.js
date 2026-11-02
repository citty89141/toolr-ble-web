// Injected into the analyzer page of the integrated ToolR site by web/build_site.mjs.
// /analyzer/?rec=<id> opens recording <id> of the recorder (/rec/). Same origin, so its RAW_xxxx.CSV files are read
// straight from the recorder's IndexedDB (app/js/store.js: database "toolr-ble-2", stores "recs" and "csv"); nothing is copied or uploaded.
(async () => {
  const id = Number(new URLSearchParams(location.search).get("rec"));
  if (!id) return;

  let db;
  try {
    db = await new Promise((resolve, reject) => {
      const r = indexedDB.open("toolr-ble-2");
      // No recorder database in this browser: abort, or an empty one would be left behind and the recorder could never add its stores
      r.onupgradeneeded = () => r.transaction.abort();
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  } catch {
    return alert("這個瀏覽器裡沒有錄製資料（錄製頁和分析頁要在同一個瀏覽器）。");
  }
  const get = (store, key) => new Promise((resolve, reject) => {
    const q = db.transaction(store).objectStore(store).get(key);
    q.onsuccess = () => resolve(q.result);
    q.onerror = () => reject(q.error);
  });

  const rec = await get("recs", id);
  const files = [];
  for (const f of rec?.csv || []) {
    const c = await get("csv", f.name);
    if (c) files.push({ part: c.part ?? 0, file: new File([c.data], c.name, { type: "text/csv" }) });
  }
  db.close();
  if (!files.length) return alert(`找不到錄製 #${rec?.rec ?? id} 的 CSV，可能已經刪除。`);
  const list = files.sort((a, b) => a.part - b.part).map((f) => f.file);

  // Hand the files to the analyzer's own "開啟檔案" input, as if the user had picked them (several parts are merged by the analyzer)
  const input = document.getElementById("file");
  try {
    const dt = new DataTransfer();
    for (const f of list) dt.items.add(f);
    input.files = dt.files;
    input.dispatchEvent(new Event("change"));
  } catch {
    window.loadFiles(list);
  }
})();
