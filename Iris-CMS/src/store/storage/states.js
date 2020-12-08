export function getDefaultState () {
  return {
    currentFolderPath: '',
    currentFolderData: [],
    recent_folder: [],
    favorite_folder: [],
    frequent_folder: {},
    frequent_folder_least_key: null,
    recent_search: [],
    // grid or list
    view_mode: 'grid',
    // cut or copy
    clipboard_mode: 'cut',
    clipboard_base_dir: 'cut',
    clipboard: [],
  }
}

const state = getDefaultState();

export default state