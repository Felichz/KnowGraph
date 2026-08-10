const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("learningDesktop", Object.freeze({
  isElectron: true,
  platform: process.platform,
  versions: Object.freeze({
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  }),
}));

