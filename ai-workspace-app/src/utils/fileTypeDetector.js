export const getFileType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase()

  const typeMap = {
    // Markdown
    'md': 'markdown',
    'markdown': 'markdown',

    // PDF
    'pdf': 'pdf',

    // Word
    'doc': 'word',
    'docx': 'word',

    // Excel
    'xls': 'excel',
    'xlsx': 'excel',
    'csv': 'excel',

    // PowerPoint
    'ppt': 'powerpoint',
    'pptx': 'powerpoint',

    // Text
    'txt': 'text',

    // Code files
    'js': 'code',
    'jsx': 'code',
    'ts': 'code',
    'tsx': 'code',
    'py': 'code',
    'java': 'code',
    'cpp': 'code',
    'c': 'code',
    'html': 'code',
    'css': 'code',
    'json': 'code',
  }

  return typeMap[extension] || 'unknown'
}

export const getFileIcon = (fileName) => {
  const fileType = getFileType(fileName)

  const iconMap = {
    'markdown': '📝',
    'pdf': '📄',
    'word': '📘',
    'excel': '📊',
    'powerpoint': '📽️',
    'text': '📃',
    'code': '💻',
    'unknown': '📎',
  }

  return iconMap[fileType] || '📎'
}
