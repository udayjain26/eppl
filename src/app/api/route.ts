import { PDFDocument, rgb } from 'pdf-lib'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Fetch data from PostgreSQL
    const data = 'HELLO WORLD'

    // Generate PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()

    // Example: Insert data into PDF
    page.drawText(`Data: ${JSON.stringify(data)}`, {
      x: 50,
      y: height - 100,
      size: 20,
      color: rgb(0, 0, 0),
    })

    const pdfBytes = await pdfDoc.save()

    // Create a NextResponse object to send the PDF
    const response = new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBytes.length.toString(),
        'Content-Disposition': 'inline; filename="example.pdf"',
      },
    })

    return response
  } catch (error) {
    console.error('Error generating PDF:', error)
    return new NextResponse('Failed to generate PDF', { status: 500 })
  }
}
