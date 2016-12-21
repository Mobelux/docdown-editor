export function isSupportedFile(filename = '') {
  return filename.search(/^.*.(md|markdown|ft|txt|csv|json|js|java|cpp|objc|m|swift)$/i) >= 0;
}

export function isPreviewableFile(filename = '') {
  return filename.search(/^.*.(md|markdown|ft|txt)$/i) >= 0;
}
