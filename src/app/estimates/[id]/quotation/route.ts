'use server'

import {
  PDFDocument,
  PDFPage,
  StandardFonts,
  degrees,
  grayscale,
  rgb,
} from 'pdf-lib'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { db } from '@/server/db'

const PAGE_WIDTH = 1240
const PAGE_HEIGHT = 1754
const IMAGE_SCALE_FACTOR = 0.15
const TEXT_SIZE = 30

export async function GET(req: NextRequest) {
  try {
    let currentPage: PDFPage | null = null
    let usedHeight = 0

    // Absolute path to the image in the public directory
    const imagePath = path.join(process.cwd(), 'public', 'letterhead.png')
    const pngImageBytes = fs.readFileSync(imagePath)

    // Get the request URL
    const requestUrl = req.nextUrl
    const pathname = requestUrl.pathname

    // Extract the id from the URL using dynamic route handling
    const regex = /^\/estimates\/([^/]+)\/quotation/
    const match = pathname.match(regex)
    const id = match ? match[1] : null

    if (!id) {
      return new NextResponse('Failed to generate PDF', { status: 500 })
    }

    const quotationData = await getAllQuotationData(id)

    if (!quotationData) {
      return new NextResponse('Failed to generate PDF', { status: 500 })
    }

    // Generate PDF
    const pdfDoc = await PDFDocument.create()
    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    const pngImage = await pdfDoc.embedPng(pngImageBytes)

    const courierFont = await pdfDoc.embedFont(StandardFonts.Courier)

    pdfDoc.setTitle(
      quotationData.estimateNumber.toString().padStart(6, '0') +
        '_' +
        quotationData.client.clientNickName,

      {
        showInWindowTitleBar: true,
      },
    )

    // Get the width/height of the PNG image scaled down to 50% of its original size
    const pngDims = pngImage.scale(0.15)

    currentPage.setLineHeight(10)

    // Draw the PNG image near the lower right corner of the JPG image
    currentPage.drawImage(pngImage, {
      x: (PAGE_WIDTH - pngDims.width) / 2,
      y: PAGE_HEIGHT - pngDims.height,
      width: pngDims.width,
      height: pngDims.height,
    })
    usedHeight += pngDims.height + 10

    // Draw text on the page
    usedHeight = drawQuotationNumberRow(
      currentPage,
      usedHeight,
      quotationData?.estimateNumber,
      courierFont,
    )

    usedHeight = drawEstimateDetails(currentPage, usedHeight, quotationData)

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

// function drawTextOnPage(currentPage: any, usedHeight: number, text: string) {
//   currentPage.drawText(text, {
//     x: 50,
//     y: PAGE_HEIGHT - usedHeight,
//     size: TEXT_SIZE,
//   })
//   usedHeight += TEXT_SIZE + 2
//   return usedHeight
// }

function drawEstimateDetails(
  currentPage: any,
  usedHeight: number,
  quotationData: any,
) {
  usedHeight += 10
  currentPage.drawText(`Title: ${quotationData.estimateTitle}`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight,
    size: TEXT_SIZE,
  })

  usedHeight += TEXT_SIZE + 2
  currentPage.drawText(`Product: ${quotationData.product.productName}`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight,
    size: TEXT_SIZE,
  })

  return (usedHeight += 100)
}

function drawQuotationNumberRow(
  currentPage: PDFPage,
  usedHeight: number,
  quotationNumber: number,
  font: any,
) {
  currentPage.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - usedHeight - 50,
    width: PAGE_WIDTH / 2,
    height: 50,
    color: rgb(0, 0, 0),
    opacity: 0.85,
  })
  currentPage.drawRectangle({
    x: PAGE_WIDTH / 2,
    y: PAGE_HEIGHT - usedHeight - 50,
    width: PAGE_WIDTH / 2,
    height: 50,
    color: rgb(1, 0, 0.9),
    opacity: 0.25,
  })

  currentPage.drawLine({
    start: { x: 0, y: PAGE_HEIGHT - usedHeight - 50 },
    end: { x: PAGE_WIDTH, y: PAGE_HEIGHT - usedHeight - 50 },
    thickness: 2,
    color: rgb(0, 0, 0),
  })

  currentPage.drawLine({
    start: {
      x: PAGE_WIDTH / 2 + PAGE_WIDTH / 4,
      y: PAGE_HEIGHT - usedHeight - 50,
    },
    end: {
      x: PAGE_WIDTH / 2 + PAGE_WIDTH / 4,
      y: PAGE_HEIGHT - usedHeight - 200,
    },
    thickness: 1,
    color: rgb(0, 0, 0),
  })

  currentPage.drawText(
    `Quotation Number: ${quotationNumber.toString().padStart(6, '0')}`,
    {
      font: font,
      color: rgb(1, 1, 1),
      x: 40,
      y: PAGE_HEIGHT - usedHeight - 40,
      size: TEXT_SIZE + 10,
    },
  )
  currentPage.drawText(`Prepared By:`, {
    font: font,
    color: rgb(0, 0, 0),
    x: PAGE_WIDTH / 2 + 10,
    y: PAGE_HEIGHT - usedHeight - 40,
    size: TEXT_SIZE + 5,
  })

  currentPage.drawText(`Prepared For:`, {
    font: font,
    color: rgb(0, 0, 0),
    x: PAGE_WIDTH / 2 + PAGE_WIDTH / 4 + 10,
    y: PAGE_HEIGHT - usedHeight - 40,
    size: TEXT_SIZE + 5,
  })
  usedHeight += 70
  return usedHeight
}

function drawDatesAndValidUntil(currentPage: PDFPage, usedHeight: number) {
  currentPage.drawText(
    `Date Created ${new Date().toLocaleDateString('en-IN')} | Valid Until: ${new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString('en-IN')}`,
    {
      x: 40,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE,
    },
  )
  usedHeight += TEXT_SIZE + 2
  return usedHeight
}

async function getAllQuotationData(uuid: string) {
  const data = await db.query.estimates.findFirst({
    where: (estimates, { eq }) => eq(estimates.uuid, uuid),
    with: {
      client: true,
      contact: true,
      product: true,
      variations: true,
    },
  })
  console.log(typeof data?.variations)
  return data
}
