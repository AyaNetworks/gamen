import {
  BsFileEarmark,
  BsFileEarmarkCode,
  BsFileEarmarkImage,
  BsFileEarmarkText,
  BsFiletypeCsv,
  BsFiletypeDocx,
  BsFiletypeMd,
  BsFiletypePdf,
  BsFiletypePptx,
  BsFiletypeXlsx,
} from 'react-icons/bs'

export const getFileType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase()

  const typeMap = {
    // Markdown
    md: 'markdown',
    markdown: 'markdown',

    // PDF
    pdf: 'pdf',

    // Word
    doc: 'word',
    docx: 'word',

    // Excel
    xls: 'excel',
    xlsx: 'excel',
    csv: 'csv',

    // PowerPoint
    ppt: 'powerpoint',
    pptx: 'powerpoint',

    // Images
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    gif: 'image',
    svg: 'image',
    webp: 'image',

    // Text
    txt: 'text',

    // Code files
    js: 'code',
    jsx: 'code',
    ts: 'code',
    tsx: 'code',
    py: 'code',
    java: 'code',
    cpp: 'code',
    c: 'code',
    html: 'code',
    css: 'code',
    json: 'code',
  }

  return typeMap[extension] || 'unknown'
}

export const getFileIcon = (fileName) => {
  const fileType = getFileType(fileName)

  const iconMap = {
    markdown: BsFiletypeMd,
    pdf: BsFiletypePdf,
    word: BsFiletypeDocx,
    excel: BsFiletypeXlsx,
    csv: BsFiletypeCsv,
    powerpoint: BsFiletypePptx,
    image: BsFileEarmarkImage,
    text: BsFileEarmarkText,
    code: BsFileEarmarkCode,
    unknown: BsFileEarmark,
  }

  return iconMap[fileType] || BsFileEarmark
}
