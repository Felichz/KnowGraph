const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("learningDesktop", Object.freeze({
  isElectron: true,
  platform: process.platform,
  versions: Object.freeze({
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  }),
  providerSettings: Object.freeze({
    load: () => ipcRenderer.invoke("provider-settings:load"),
    save: (profile) => ipcRenderer.invoke("provider-settings:save", profile),
    clear: () => ipcRenderer.invoke("provider-settings:clear"),
  }),
  backup: Object.freeze({
    save: (content, defaultFilename) => ipcRenderer.invoke("backup:save", { content, defaultFilename }),
    load: () => ipcRenderer.invoke("backup:load"),
  }),
}));
