export default async function getAllSelectedFiles(
  storage,
  tempfiles,
  opt = {
    getDownloadUrl: false,
    downloadCurrentFolder: false,
  }
) {
  let lfs = [];
  for (const file of tempfiles) {
    if (file.selected || opt.downloadCurrentFolder)
      if (file.type == "file") {
        lfs.push(file);
      } else {
        // folder dive
        let tfiles = await storage
          .ref(file.fullPath)
          .listAll()
          .then(async (t) => {
            let folders = t.prefixes.map((folder) => {
              return {
                title: folder.name,
                ref: folder.fullPath,
                icon: "FolderIcon",
                expanded: false,
                async: true,
                selected: true,
              };
            });
            let folders_mod = folders.map((f) => {
              return {
                selected: f.selected,
                filename: f.title,
                size: null,
                fullPath: f.ref,
                type: "folder",
              };
            });
            let files = await Promise.all(
              t.items.map(async (t) => {
                let res = {
                  fullPath: t.fullPath,
                  filename: t.name,
                  selected: true,
                  type: "file",
                  size: null,
                };
                if (opt.getDownloadUrl) {
                  res.downloadUrl = await t.getDownloadURL();
                }
                return res;
              })
            );

            return folders_mod.concat(files);
          });
        lfs.push(...(await getAllSelectedFiles(storage, tfiles, opt)));
      }
  }
  return lfs;
}
