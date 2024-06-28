'use server'

import {
  PDFDocument,
  PDFPage,
  StandardFonts,
  clip,
  degrees,
  grayscale,
  rgb,
} from 'pdf-lib'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { db } from '@/server/db'
import { max } from 'drizzle-orm'
import { init } from 'next/dist/compiled/webpack/webpack'

const PAGE_WIDTH = 1240
const PAGE_HEIGHT = 1754
const IMAGE_SCALE_FACTOR = 0.15
const TEXT_SIZE = 25

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
    const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBoldFont = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold,
    )

    pdfDoc.setTitle(
      quotationData.estimateNumber.toString().padStart(6, '0') +
        '_' +
        quotationData.client.clientNickName,

      {
        showInWindowTitleBar: true,
      },
    )

    // Get the width/height of the PNG image scaled down to 50% of its original size
    const pngDims = pngImage.scale(0.1)

    currentPage.setLineHeight(25)

    // Draw the PNG image near the top left corner of the JPG image
    currentPage.drawImage(pngImage, {
      x: 40,
      y: PAGE_HEIGHT - pngDims.height,
      width: pngDims.width,
      height: pngDims.height,
    })
    drawDatesData(currentPage, usedHeight, quotationData)
    usedHeight += pngDims.height + 10

    // Draw text on the page
    usedHeight = drawQuotationNumberRow(
      currentPage,
      usedHeight,
      quotationData?.estimateNumber,
      courierFont,
      timesFont,
    )

    usedHeight = drawEstimateDetails(
      currentPage,
      usedHeight,
      quotationData,
      timesFont,
    )

    drawVariationsTable(
      pdfDoc,
      currentPage,
      usedHeight,
      quotationData,
      helveticaFont,
      timesFont,
      helveticaBoldFont,
    )

    const pdfBytes = await pdfDoc.save()

    // Create a NextResponse object to send the PDF
    const response = new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBytes.length.toString(),
        'Content-Disposition': `inline; filename="${quotationData.estimateNumber.toString().padStart(6, '0')}_${quotationData.client.clientNickName}.pdf"`,
      },
    })

    return response
  } catch (error) {
    console.error('Error generating PDF:', error)
    return new NextResponse('Failed to generate PDF', { status: 500 })
  }
}

function drawDatesData(
  currentPage: PDFPage,
  usedHeight: number,
  quotationData: any,
) {
  currentPage.drawText(`System Reference ID: ${quotationData.uuid}`, {
    x: PAGE_WIDTH - 300,
    y: PAGE_HEIGHT - 10,
    size: TEXT_SIZE - 15,
    maxWidth: PAGE_WIDTH - 40,
  })
  currentPage.drawText(
    `Date Created: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    {
      x: PAGE_WIDTH - 300,
      y: PAGE_HEIGHT - 175,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH - 40,
    },
  )
  usedHeight += TEXT_SIZE
  currentPage.drawText(
    `Valid Until: ${new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    {
      x: PAGE_WIDTH - 300,
      y: PAGE_HEIGHT - 175 - usedHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH - 40,
    },
  )
  usedHeight += TEXT_SIZE + 2

  return usedHeight
}

function drawEstimateDetails(
  currentPage: PDFPage,
  usedHeight: number,
  quotationData: any,
  font: any,
) {
  usedHeight += 10

  const clientName = quotationData.client.clientFullName
    ? quotationData.client.clientFullName + '\n'
    : ''
  const clientGSTIN = quotationData.client.gstin
    ? quotationData.client.gstin + '\n'
    : ''
  const clientAddressLine1 = quotationData.client.clientAddressLine1
    ? quotationData.client.clientAddressLine1
    : ''
  const clientAddressLine2 = quotationData.client.clientAddressLine2
    ? ', ' + quotationData.client.clientAddressLine2
    : ''
  const clientCity = quotationData.client.clientAddressCity
    ? ', ' + quotationData.client.clientAddressCity
    : ''
  const clientState = quotationData.client.clientAddressState
    ? ', ' + quotationData.client.clientAddressState
    : ''
  const clientPincode = quotationData.client.clientAddressPincode
    ? ' - ' + quotationData.client.clientAddressPincode + '\n'
    : ''

  const contactFirstName = quotationData.contact.contactFirstName
    ? quotationData.contact.contactFirstName + ' '
    : ''
  const contactLastName = quotationData.contact.contactLastName
    ? quotationData.contact.contactLastName + '\n'
    : ''
  const contactMobile = quotationData.contact.contactMobile
    ? quotationData.contact.contactMobile + '\n'
    : ''

  const contactEmail = quotationData.contact.contactEmail
    ? quotationData.contact.contactEmail + '\n'
    : ''

  currentPage.drawText(
    `Product Type: ${quotationData.productType.productsTypeName}`,
    {
      x: 40,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE,
    },
  )

  usedHeight = usedHeight + TEXT_SIZE + 10

  currentPage.drawText(`Product: ${quotationData.product.productName}`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight,
    size: TEXT_SIZE,
  })

  usedHeight = usedHeight + TEXT_SIZE + 10

  currentPage.drawText(`Title: ${quotationData.estimateTitle}`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight,
    size: TEXT_SIZE - 5,
    maxWidth: PAGE_WIDTH / 2 - 10,
  })

  usedHeight = usedHeight + TEXT_SIZE
  currentPage.drawText(`Description: ${quotationData.estimateDescription}`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight,
    size: TEXT_SIZE - 5,
    maxWidth: PAGE_WIDTH / 2 - 10,
  })

  usedHeight = usedHeight - TEXT_SIZE * 3 - 30

  currentPage.drawText(
    `Excel Printers Private Limited \n07AABCE1085B1Z6\nA/82, Third Floor, Naraina Industrial Area Phase 1, New Delhi, Delhi - 110028\nUday Jain\n8588835451\nuday@excelprinters.com`,
    {
      x: PAGE_WIDTH / 2 + 5,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH / 4,
      font: font,
    },
  )
  currentPage.drawText(
    `${clientName}${clientGSTIN}${clientAddressLine1}${clientAddressLine2}${clientCity}${clientState}${clientPincode}${contactFirstName}${contactLastName}${contactMobile}${contactEmail}`,
    {
      x: PAGE_WIDTH / 2 + PAGE_WIDTH / 4 + 5,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH / 4 - 40,
      font: font,
    },
  )
  usedHeight += TEXT_SIZE + 250

  return usedHeight
}

function drawQuotationNumberRow(
  currentPage: PDFPage,
  usedHeight: number,
  quotationNumber: number,
  font: any,
  timesFont: any,
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
      y: PAGE_HEIGHT - usedHeight - 300,
    },
    thickness: 1,
    color: rgb(0, 0, 0),
  })
  currentPage.drawLine({
    start: { x: 0, y: PAGE_HEIGHT - usedHeight - 300 },
    end: { x: PAGE_WIDTH, y: PAGE_HEIGHT - usedHeight - 300 },
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
    font: timesFont,
    color: rgb(0, 0, 0),
    x: PAGE_WIDTH / 2 + 10,
    y: PAGE_HEIGHT - usedHeight - 40,
    size: TEXT_SIZE + 5,
  })

  currentPage.drawText(`Prepared For:`, {
    font: timesFont,
    color: rgb(0, 0, 0),
    x: PAGE_WIDTH / 2 + PAGE_WIDTH / 4 + 10,
    y: PAGE_HEIGHT - usedHeight - 40,
    size: TEXT_SIZE + 5,
  })
  usedHeight += 70
  return usedHeight
}

// function drawDatesAndValidUntil(currentPage: PDFPage, usedHeight: number) {
//   currentPage.drawText(
//     `Date Created ${new Date().toLocaleDateString('en-IN')} | Valid Until: ${new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString('en-IN')}`,
//     {
//       x: 40,
//       y: PAGE_HEIGHT - usedHeight,
//       size: TEXT_SIZE,
//     },
//   )
//   usedHeight += TEXT_SIZE + 2
//   return usedHeight
// }

function drawVariationsTable(
  pdfDoc: PDFDocument,
  currentPage: PDFPage,
  usedHeight: number,
  quotationData: any,
  helveticaFont: any,
  timesFont: any,
  helveticaBoldFont: any,
) {
  const initialHeight = usedHeight

  quotationData.variations.forEach((variation: any, index: number) => {
    let insideInitialHeight = usedHeight
    currentPage.drawText(`${variation.variationTitle}`, {
      x: 40,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE,
    })
    usedHeight += TEXT_SIZE + 5

    const text = `Additional Notes: ${variation.variationNotes ? variation.variationNotes : 'None'}`
    const textWidth = helveticaFont.widthOfTextAtSize(text, TEXT_SIZE - 5)
    const textHeightFactor = textWidth / (PAGE_WIDTH - 80) + 1
    currentPage.drawText(
      `Additional Notes: ${variation.variationNotes ? variation.variationNotes : ''}`,
      {
        x: 40,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 40,
      },
    )
    usedHeight += TEXT_SIZE * textHeightFactor

    currentPage.drawText(`Size Details`, {
      x: 60,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH - 60,
      font: helveticaBoldFont,
    })

    usedHeight += TEXT_SIZE

    if (
      variation.closeSizeName &&
      variation.closeSizeLength &&
      variation.closeSizeWidth
    ) {
      currentPage.drawText(
        `Close Size: ${variation.closeSizeName}- ${variation.closeSizeLength}mm x ${variation.closeSizeWidth}mm / ${Number(variation.closeSizeLength / 25.4).toFixed(2)}in x ${Number(variation.closeSizeWidth / 25.4).toFixed(2)}in`,
        {
          x: 80,
          y: PAGE_HEIGHT - usedHeight,
          size: TEXT_SIZE - 5,
          maxWidth: PAGE_WIDTH - 80,
        },
      )
      usedHeight += TEXT_SIZE + 5
    }

    if (
      variation.openSizeName &&
      variation.openSizeLength &&
      variation.openSizeWidth
    ) {
      currentPage.drawText(
        `Open Size: ${variation.openSizeName}- ${variation.openSizeLength}mm x ${variation.openSizeWidth}mm / ${Number(variation.openSizeLength / 25.4).toFixed(2)}in x ${Number(variation.openSizeWidth / 25.4).toFixed(2)}in`,
        {
          x: 80,
          y: PAGE_HEIGHT - usedHeight,
          size: TEXT_SIZE - 5,
          maxWidth: PAGE_WIDTH - 80,
        },
      )
      usedHeight += TEXT_SIZE + 5
    }
    if (
      quotationData.productType.productsTypeName === 'Catalogs' ||
      quotationData.productType.productsTypeName === 'Books' ||
      quotationData.productType.productsTypeName === 'Annual Reports' ||
      quotationData.productType.productsTypeName === 'Brochures' ||
      quotationData.productType.productsTypeName === "Children's Books" ||
      quotationData.productType.productsTypeName === 'Magazines' ||
      quotationData.productType.productsTypeName === 'Diaries' ||
      quotationData.productType.productsTypeName === 'Notebooks' ||
      quotationData.productType.productsTypeName === 'Pads'
    ) {
      currentPage.drawText(`Cover Details`, {
        x: 60,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 60,
        font: helveticaBoldFont,
      })

      usedHeight += TEXT_SIZE + 5
    } else {
      currentPage.drawText(`Sheet Details`, {
        x: 60,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 60,
        font: helveticaBoldFont,
      })

      usedHeight += TEXT_SIZE + 5
    }

    currentPage.drawText(
      `Colors: ${variation.coverFrontColors} + ${variation.coverBackColors}`,
      {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      },
    )
    usedHeight += TEXT_SIZE

    currentPage.drawText(`Pages: ${variation.coverPages}`, {
      x: 80,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH - 80,
    })
    usedHeight += TEXT_SIZE

    currentPage.drawText(`Grammage: ${variation.coverGrammage} GSM`, {
      x: 80,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH - 80,
    })
    usedHeight += TEXT_SIZE

    currentPage.drawText(`Lamination: ${variation.coverLamination}`, {
      x: 80,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH - 80,
    })
    usedHeight += TEXT_SIZE

    let selectedPaper = variation.variationCalculations[0].coverPaper
    let result = selectedPaper
      .replace(/\b\d{2}\.\d{2}x\d{2}\.\d{2}\/\d+gsm\b/, '')
      .trim()

    currentPage.drawText(`Selected Paper: ${result}`, {
      x: 80,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH - 80,
    })
    usedHeight += TEXT_SIZE + 5
    if (
      quotationData.productType.productsTypeName === 'Catalogs' ||
      quotationData.productType.productsTypeName === 'Books' ||
      quotationData.productType.productsTypeName === 'Annual Reports' ||
      quotationData.productType.productsTypeName === 'Brochures' ||
      quotationData.productType.productsTypeName === "Children's Books" ||
      quotationData.productType.productsTypeName === 'Magazines' ||
      quotationData.productType.productsTypeName === 'Diaries' ||
      quotationData.productType.productsTypeName === 'Notebooks' ||
      quotationData.productType.productsTypeName === 'Pads'
    ) {
      currentPage.drawText(`Text Details`, {
        x: 60,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 60,
        font: helveticaBoldFont,
      })

      usedHeight += TEXT_SIZE + 5

      currentPage.drawText(
        `Colors: ${variation.textColors} + ${variation.textColors}`,
        {
          x: 80,
          y: PAGE_HEIGHT - usedHeight,
          size: TEXT_SIZE - 5,
          maxWidth: PAGE_WIDTH - 80,
        },
      )
      usedHeight += TEXT_SIZE

      currentPage.drawText(`Pages: ${variation.textPages}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE

      currentPage.drawText(`Grammage: ${variation.textGrammage} GSM`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE

      if (
        variation.textLamination !== 'None' &&
        variation.textLamination !== undefined &&
        variation.textLamination !== null
      ) {
        currentPage.drawText(`Lamination: ${variation.textLamination}`, {
          x: 80,
          y: PAGE_HEIGHT - usedHeight,
          size: TEXT_SIZE - 5,
          maxWidth: PAGE_WIDTH - 80,
        })
        usedHeight += TEXT_SIZE
      }
      let selectedPaper = variation.variationCalculations[0].textPaper
      let result = selectedPaper
        .replace(/\b\d{2}\.\d{2}x\d{2}\.\d{2}\/\d+gsm\b/, '')
        .trim()

      currentPage.drawText(`Selected Paper: ${result}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE + 5
    }

    currentPage.drawText(`Fabrication Details`, {
      x: 60,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH - 60,
      font: helveticaBoldFont,
    })

    usedHeight += TEXT_SIZE + 5

    if (
      variation.binding !== 'None' &&
      variation.binding !== undefined &&
      variation.binding !== null
    ) {
      currentPage.drawText(`Binding: ${variation.binding}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.coverUV !== 'None' &&
      variation.coverUV !== undefined &&
      variation.coverUV !== null
    ) {
      currentPage.drawText(`Cover UV: ${variation.coverUV}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.textUV !== 'None' &&
      variation.textUV !== undefined &&
      variation.textUV !== null
    ) {
      currentPage.drawText(`Text UV: ${variation.textUV}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.coverCoating !== 'None' &&
      variation.coverCoating !== undefined &&
      variation.coverCoating !== null
    ) {
      currentPage.drawText(`Cover Coating: ${variation.coverCoating}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.textCoating !== 'None' &&
      variation.textCoating !== undefined &&
      variation.textCoating !== null
    ) {
      currentPage.drawText(`Text Coating: ${variation.textCoating}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.coverEmbossing !== 'None' &&
      variation.coverEmbossing !== undefined &&
      variation.coverEmbossing !== null
    ) {
      currentPage.drawText(`Cover Embossing: ${variation.coverEmbossing}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.coverFoiling !== 'None' &&
      variation.coverFoiling !== undefined &&
      variation.coverFoiling !== null
    ) {
      currentPage.drawText(`Cover Foiling: ${variation.coverFoiling}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }

    if (
      variation.vdp !== 'None' &&
      variation.vdp !== undefined &&
      variation.vdp !== null
    ) {
      currentPage.drawText(`VDP: ${variation.vdp}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.coverDieCutting !== 'None' &&
      variation.coverDieCutting !== undefined &&
      variation.coverDieCutting !== null
    ) {
      currentPage.drawText(
        `Die Cutting(Outside): ${variation.coverDieCutting}`,
        {
          x: 80,
          y: PAGE_HEIGHT - usedHeight,
          size: TEXT_SIZE - 5,
          maxWidth: PAGE_WIDTH - 80,
        },
      )
      usedHeight += TEXT_SIZE
    }
    if (
      variation.textDieCutting !== 'None' &&
      variation.textDieCutting !== undefined &&
      variation.textDieCutting !== null
    ) {
      currentPage.drawText(`Die Cutting(Inside): ${variation.textDieCutting}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.gumming !== 'None' &&
      variation.gumming !== undefined &&
      variation.gumming !== null
    ) {
      currentPage.drawText(`Gumming: ${variation.gumming}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }

    currentPage.drawText(`Packaging Details`, {
      x: 60,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH - 60,
      font: helveticaBoldFont,
    })

    usedHeight += TEXT_SIZE + 5

    if (
      variation.packagingType !== 'None' &&
      variation.packagingType !== undefined &&
      variation.packagingType !== null
    ) {
      currentPage.drawText(`Packaging: ${variation.packagingType}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }
    // Example usage in the GET function
    let usedHeightFromTable = drawRatesTable(
      currentPage,
      insideInitialHeight,
      variation,
      helveticaFont,
      helveticaBoldFont,
    )

    usedHeight += 30
  })
}

function drawRatesTable(
  currentPage: PDFPage,
  usedHeight: number,
  variation: any,
  font: any,
  boldFont: any,
) {
  const initialHeight = usedHeight + 80
  usedHeight = usedHeight + 50

  currentPage.drawText(`Rates Table`, {
    x: PAGE_WIDTH / 2 + 200,
    y: PAGE_HEIGHT - usedHeight,
    size: TEXT_SIZE - 5,
  })

  usedHeight += TEXT_SIZE + 5

  // Define table headers
  const headers = ['Quantity', 'Rate']
  const headerXPositions = [200, 305] // Adjust these positions as needed

  // Draw table headers
  headers.forEach((header, index) => {
    currentPage.drawText(header, {
      x: PAGE_WIDTH / 2 + headerXPositions[index],
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 5,
    })
  })

  usedHeight += TEXT_SIZE + 10

  let indexMax = 0

  // // Draw table rows
  variation.variationQtysRates.forEach((row: any, index: number) => {
    indexMax = index
    const rowYPosition = PAGE_HEIGHT - usedHeight - index * (TEXT_SIZE + 5)

    currentPage.drawText(row.quantity.toString(), {
      x: PAGE_WIDTH / 2 + headerXPositions[0],
      y: rowYPosition,
      size: TEXT_SIZE - 5,
      font: font,
    })

    currentPage.drawText(row.rate.toString(), {
      x: PAGE_WIDTH / 2 + headerXPositions[1],
      y: rowYPosition,
      size: TEXT_SIZE - 5,
      font: font,
    })

    usedHeight += TEXT_SIZE - 10
  })

  usedHeight += TEXT_SIZE * indexMax + 20

  currentPage.drawLine({
    start: { x: PAGE_WIDTH / 2 + 300, y: PAGE_HEIGHT - initialHeight + 20 },
    end: { x: PAGE_WIDTH / 2 + 300, y: PAGE_HEIGHT - usedHeight },
    thickness: 1,
    color: rgb(0, 0, 0),
  })

  currentPage.drawLine({
    start: { x: PAGE_WIDTH / 2 + 200, y: PAGE_HEIGHT - initialHeight - 5 },
    end: { x: PAGE_WIDTH / 2 + 400, y: PAGE_HEIGHT - initialHeight - 5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  })

  return usedHeight
}

async function getAllQuotationData(uuid: string) {
  const data = await db.query.estimates.findFirst({
    where: (estimates, { eq }) => eq(estimates.uuid, uuid),
    with: {
      client: true,
      contact: true,
      product: true,
      productType: true,
      variations: {
        with: {
          variationQtysRates: true,
          variationCalculations: true,
        },
      },
    },
  })
  return data
}
