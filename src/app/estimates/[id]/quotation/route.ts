import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  try {

    // Absolute path to the image in the public directory
    const imagePath = path.join(process.cwd(), 'public', 'letterhead.png')
    const pngImageBytes = fs.readFileSync(imagePath)

    console.log('PNG Image Bytes:', pngImageBytes)

    // Get the request URL
    const requestUrl = req.nextUrl
    const pathname = requestUrl.pathname

    // Extract the id from the URL using dynamic route handling
    const regex = /^\/estimates\/([^/]+)\/quotation/
    const match = pathname.match(regex)
    const id = match ? match[1] : null

    console.log(`Request ID: ${id}`)

    // Generate PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([1240, 1754])
    const { width, height } = page.getSize()
    console.log(`PDF Page Size: ${width} x ${height}`)
    const pngImage = await pdfDoc.embedPng(pngImageBytes)

    // Get the width/height of the PNG image scaled down to 50% of its original size
    const pngDims = pngImage.scale(0.15)

    // Draw the PNG image near the lower right corner of the JPG image
    page.drawImage(pngImage, {
      x: (width - pngDims.width) / 2,
      y: height - pngDims.height,
      width: pngDims.width,
      height: pngDims.height,
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
