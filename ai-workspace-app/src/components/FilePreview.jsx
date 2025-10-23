import mammoth from 'mammoth'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import * as XLSX from 'xlsx'
import { getFileType } from '../utils/fileTypeDetector'
import 'highlight.js/styles/github-dark.css'
import './FilePreview.css'

function FilePreview({ item }) {
  const [parsedContent, setParsedContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fileData, setFileData] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [error, setError] = useState(null)
  const fileType = getFileType(item.name)

  useEffect(() => {
    const parseFile = async () => {
      let file = item.file
      setError(null)

      // If filePath is provided, fetch the file from the path
      if (!file && item.filePath) {
        setLoading(true)
        try {
          const response = await fetch(item.filePath)
          if (!response.ok) throw new Error('Failed to fetch file')
          const blob = await response.blob()
          file = new File([blob], item.name, { type: blob.type || 'application/pdf' })
          setFileData(file)

          // Create URL for PDF
          if (fileType === 'pdf') {
            const url = URL.createObjectURL(blob)
            setPdfUrl(url)
          }
        } catch (error) {
          console.error('Error fetching file:', error)
          setError('ファイルの読み込みに失敗しました。')
          setLoading(false)
          return
        }
      } else {
        setFileData(file)
        if (file && fileType === 'pdf') {
          const url = URL.createObjectURL(file)
          setPdfUrl(url)
        }
      }

      if (!file) return

      setLoading(true)
      try {
        if (fileType === 'excel') {
          const data = await file.arrayBuffer()
          const workbook = XLSX.read(data)
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const htmlString = XLSX.utils.sheet_to_html(firstSheet)
          setParsedContent(htmlString)
        } else if (fileType === 'word') {
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          setParsedContent(result.value)
        }
      } catch (error) {
        console.error('Error parsing file:', error)
        setError('ファイルの解析に失敗しました。')
        setParsedContent('<p>ファイルの解析に失敗しました。</p>')
      } finally {
        setLoading(false)
      }
    }

    parseFile()

    // Cleanup PDF URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [item, fileType])

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  if (fileType === 'markdown') {
    return (
      <div className="preview-markdown">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{item.content}</ReactMarkdown>
      </div>
    )
  }

  if (fileType === 'pdf') {
    if (error) {
      return (
        <div className="preview-error">
          <p>{error}</p>
          <p className="error-detail">ファイル名: {item.name}</p>
        </div>
      )
    }

    if (loading) {
      return <div className="preview-loading">PDFを読み込んでいます...</div>
    }

    if (pdfUrl || item.filePath) {
      return (
        <div className="preview-pdf-container">
          <iframe src={pdfUrl || item.filePath} className="pdf-iframe" title={item.name} />
        </div>
      )
    }
  }

  if (fileType === 'excel') {
    if (loading) {
      return <div className="preview-loading">Excelファイルを読み込んでいます...</div>
    }
    return <div className="preview-excel" dangerouslySetInnerHTML={{ __html: parsedContent }} />
  }

  if (fileType === 'word') {
    if (loading) {
      return <div className="preview-loading">Wordファイルを読み込んでいます...</div>
    }
    return <div className="preview-word" dangerouslySetInnerHTML={{ __html: parsedContent }} />
  }

  if (fileType === 'image') {
    const imageSrc = item.filePath || (item.file ? URL.createObjectURL(item.file) : null)
    if (imageSrc) {
      return (
        <div className="preview-image">
          <img src={imageSrc} alt={item.name} />
        </div>
      )
    }
  }

  if (fileType === 'powerpoint') {
    const file = fileData || item.file
    return (
      <div className="preview-unsupported">
        <div className="unsupported-icon">📽️</div>
        <h3>PowerPointファイル</h3>
        <p className="unsupported-message">
          PowerPointファイルのプレビューは現在対応していません。
        </p>
        <div className="file-info">
          <p>
            <strong>ファイル名:</strong> {item.name}
          </p>
          {file && (
            <p>
              <strong>サイズ:</strong> {(file.size / 1024).toFixed(2)} KB
            </p>
          )}
        </div>
        <p className="unsupported-note">
          ファイルをダウンロードして、PowerPointアプリで開いてください。
        </p>
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
