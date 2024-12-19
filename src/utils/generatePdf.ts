import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDF(elem: HTMLElement) {
  // Clone the element
  const elementClone = elem.cloneNode(true) as HTMLElement
  document.body.appendChild(elementClone) // This ensures that the DOM is present before the conversion into the PDF

  try {
    const canvas = await html2canvas(elementClone, {
      scale: 2, // Increase scale for better quality
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')

    // Calculate PDF page dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    // Get canvas size and calculate scale to keep aspect ratio
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const scale = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)

    // Calculate image position in PDF (centered)
    // const x = (pdfWidth - imgWidth * scale) / 2
    // const y = (pdfHeight - imgHeight * scale) / 2

    // Set the image position for top-left alignment
    const x = 0
    const y = 0

    pdf.addImage(imgData, 'PNG', x, y, imgWidth * scale, imgHeight * scale)
    return pdf
  } finally {
    // Clean up: remove the clone
    document.body.removeChild(elementClone)
  }
}
