import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { Document, Page, pdfjs } from 'react-pdf'
import * as XLSX from 'xlsx'
import mammoth from 'mammoth'
import { getFileType } from '../utils/fileTypeDetector'
import 'highlight.js/styles/github-dark.css'
import './FilePreview.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

function FilePreview({ item }) {
  const [numPages, setNumPages] = useState(null)
  const [parsedContent, setParsedContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileType = getFileType(item.name)

  useEffect(() => {
    const parseFile = async () => {
      if (!item.file) return

      setLoading(true)
      try {
        if (fileType === 'excel') {
          const data = await item.file.arrayBuffer()
          const workbook = XLSX.read(data)
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const htmlString = XLSX.utils.sheet_to_html(firstSheet)
          setParsedContent(htmlString)
        } else if (fileType === 'word') {
          const arrayBuffer = await item.file.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          setParsedContent(result.value)
        }
      } catch (error) {
        console.error('Error parsing file:', error)
        setParsedContent('<p>ファイルの解析に失敗しました。</p>')
      } finally {
        setLoading(false)
      }
    }

    parseFile()
  }, [item, fileType])

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  if (fileType === 'markdown') {
    return (
      <div className="preview-markdown">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {item.content}
        </ReactMarkdown>
      </div>
    )
  }

  if (fileType === 'pdf' && item.file) {
    return (
      <div className="preview-pdf">
        <Document
          file={item.file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="preview-loading">PDFを読み込んでいます...</div>}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={600}
            />
          ))}
        </Document>
        {numPages && (
          <div className="pdf-info">
            総ページ数: {numPages}
          </div>
        )}
      </div>
    )
  }

  if (fileType === 'excel') {
    if (loading) {
      return <div className="preview-loading">Excelファイルを読み込んでいます...</div>
    }
    return (
      <div className="preview-excel" dangerouslySetInnerHTML={{ __html: parsedContent }} />
    )
  }

  if (fileType === 'word') {
    if (loading) {
      return <div className="preview-loading">Wordファイルを読み込んでいます...</div>
    }
    return (
      <div className="preview-word" dangerouslySetInnerHTML={{ __html: parsedContent }} />
    )
  }

  if (fileType === 'powerpoint') {
    return (
      <div className="preview-unsupported">
        <p>PowerPointファイルのプレビューは現在サポートされていません。</p>
        <p>ファイル名: {item.name}</p>
      </div>
    )
  }

  if (fileType === 'code' || fileType === 'text') {
    return (
      <div className="preview-code">
        <pre>{item.content}</pre>
      </div>
    )
  }

  // Default fallback
  return (
    <div className="preview-default">
      <pre>{item.content}</pre>
    </div>
  )
}

export default FilePreview
