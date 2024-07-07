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

    // const textureBackgroundImagePath = path.join(
    //   process.cwd(),
    //   'public',
    //   'texture-paper.jpg',
    // )

    const textureBackgroundImagePath = path.join(
      process.cwd(),
      'public',
      'white-texture.jpg',
    )

    const jpgImageBytes = fs.readFileSync(textureBackgroundImagePath)

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
    const jpgImage = await pdfDoc.embedJpg(jpgImageBytes)

    const courierFont = await pdfDoc.embedFont(StandardFonts.Courier)
    const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const timesFontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBoldFont = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold,
    )

    pdfDoc.setTitle(
      quotationData.estimateNumber.toString().padStart(6, '0') +
        '_' +
        quotationData.client.clientNickName +
        '_' +
        quotationData.product.productName,

      {
        showInWindowTitleBar: true,
      },
    )

    // Get the width/height of the PNG image scaled down to 50% of its original size
    const pngDims = pngImage.scale(0.1)

    currentPage.setLineHeight(25)
    currentPage.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      opacity: 0.33,
    })

    // Draw the PNG image near the top left corner of the JPG image
    currentPage.drawImage(pngImage, {
      x: 40,
      y: PAGE_HEIGHT - pngDims.height,
      width: pngDims.width,
      height: pngDims.height,
    })

    drawDatesData(currentPage, usedHeight, quotationData)
    usedHeight += pngDims.height

    usedHeight = drawEstimateDetails(
      currentPage,
      usedHeight,
      quotationData,
      timesFont,
      timesFontBold,
    )
    // // Draw text on the page
    // usedHeight = drawQuotationNumberRow(
    //   currentPage,
    //   usedHeight,
    //   quotationData,
    //   courierFont,
    //   timesFont,
    // )

    let variationTableResult = drawVariationsTable(
      pdfDoc,
      currentPage,
      usedHeight,
      quotationData,
      helveticaFont,
      timesFont,
      helveticaBoldFont,
    )

    currentPage = variationTableResult.currentPage
    usedHeight = variationTableResult.usedHeight

    drawFooter(
      currentPage,
      usedHeight,
      timesFont,
      timesFontBold,
      pdfDoc,
      quotationData,
    )

    const pdfBytes = await pdfDoc.save()

    // Create a NextResponse object to send the PDF
    const response = new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBytes.length.toString(),
        // 'Content-Disposition': `inline; filename="${quotationData.estimateNumber.toString().padStart(6, '0')}_${quotationData.client.clientNickName}_${quotationData.product.productName}.pdf"`,
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
  currentPage.drawText(`Estimate uuid: ${quotationData.uuid}`, {
    x: PAGE_WIDTH - 400,
    y: PAGE_HEIGHT - 15,
    size: TEXT_SIZE - 10,
    // maxWidth: PAGE_WIDTH - 40,
  })

  return usedHeight
}

function drawEstimateDetails(
  currentPage: PDFPage,
  usedHeight: number,
  quotationData: any,
  font: any,
  fontBold: any,
) {
  let initHeight = usedHeight + TEXT_SIZE + 10

  const clientName = quotationData.client.clientFullName
    ? quotationData.client.clientFullName + '\n'
    : ''
  const clientGSTIN = quotationData.client.gstin
    ? quotationData.client.gstin + '\n'
    : ''
  const clientAddressLine1 = quotationData.client.clientAddressLine1
    ? quotationData.client.clientAddressLine1 + ', '
    : ''
  const clientAddressLine2 = quotationData.client.clientAddressLine2
    ? quotationData.client.clientAddressLine2 + ', '
    : ''
  const clientCity = quotationData.client.clientAddressCity
    ? quotationData.client.clientAddressCity + ', '
    : ''
  const clientState = quotationData.client.clientAddressState
    ? quotationData.client.clientAddressState + ', '
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

  currentPage.drawRectangle({
    x: 30,
    y: PAGE_HEIGHT - usedHeight - 240,
    width: PAGE_WIDTH - 60,
    height: 240,
    color: rgb(0.95, 0.45, 0.2),
    opacity: 0.35,
  })

  usedHeight = usedHeight + TEXT_SIZE + 10

  currentPage.drawText(`${clientName}`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight,
    size: TEXT_SIZE + 5,
    maxWidth: PAGE_WIDTH,
    font: fontBold,
  })
  usedHeight = usedHeight + TEXT_SIZE + 10
  currentPage.drawText(
    `${clientGSTIN}${clientAddressLine1}${clientAddressLine2}${clientCity}${clientState}${clientPincode}`,
    {
      x: 40,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 5,
      maxWidth: ((PAGE_WIDTH - 40) * 2) / 3 - 40,
      font: font,
    },
  )
  usedHeight = usedHeight + TEXT_SIZE + 40

  currentPage.drawText(`${contactFirstName}${contactLastName}`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight,
    size: TEXT_SIZE,
    maxWidth: ((PAGE_WIDTH - 60) * 2) / 3,
    font: fontBold,
  })
  usedHeight = usedHeight + TEXT_SIZE + 10
  currentPage.drawText(`${contactMobile}${contactEmail}`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight,
    size: TEXT_SIZE - 5,
    maxWidth: ((PAGE_WIDTH - 60) * 2) / 3,
    font: font,
  })

  usedHeight = usedHeight + TEXT_SIZE + 10

  currentPage.drawText(
    `Quotation Number: ${quotationData.estimateNumber.toString().padStart(6, '0')}`,
    {
      x: ((PAGE_WIDTH - 40) * 2) / 3 - 40 + 150,
      y: PAGE_HEIGHT - initHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH - 40,
    },
  )
  initHeight += TEXT_SIZE

  currentPage.drawText(
    `Date Created: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    {
      x: ((PAGE_WIDTH - 40) * 2) / 3 - 40 + 150,
      y: PAGE_HEIGHT - initHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH - 40,
    },
  )
  initHeight += TEXT_SIZE
  currentPage.drawText(
    `Valid Until: ${new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    {
      x: ((PAGE_WIDTH - 40) * 2) / 3 - 40 + 150,
      y: PAGE_HEIGHT - initHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH - 40,
    },
  )
  initHeight += TEXT_SIZE

  initHeight += 40
  currentPage.drawText(`Title: ${quotationData.estimateTitle}`, {
    x: ((PAGE_WIDTH - 40) * 2) / 3 - 40 + 150,
    y: PAGE_HEIGHT - initHeight,
    size: TEXT_SIZE - 5,
    maxWidth: PAGE_WIDTH / 4 - 40,
  })

  // currentPage.drawText(
  //   `Excel Printers Private Limited \n07AABCE1085B1Z6\nA/82, Third Floor, Naraina Industrial Area Phase 1, New Delhi, Delhi - 110028\nUday Jain\n8588835451\nuday@excelprinters.com`,
  //   {
  //     x: PAGE_WIDTH / 2 + 5,
  //     y: PAGE_HEIGHT - usedHeight,
  //     size: TEXT_SIZE - 5,
  //     maxWidth: PAGE_WIDTH / 4,
  //     font: font,
  //   },
  // )

  usedHeight += 50

  return usedHeight
}

function drawQuotationNumberRow(
  currentPage: PDFPage,
  usedHeight: number,
  quotationData: any,
  font: any,
  timesFont: any,
) {
  currentPage.drawRectangle({
    x: 30,
    y: PAGE_HEIGHT - usedHeight - 300,
    width: PAGE_WIDTH - 60,
    height: 240,
    color: rgb(0.95, 0.45, 0.2),
    opacity: 0.35,
  })

  currentPage.drawRectangle({
    x: 30,
    y: PAGE_HEIGHT - usedHeight - 410,
    width: PAGE_WIDTH - 60,
    height: 100,
    color: rgb(0, 0, 0),
    opacity: 0.1,
  })
  currentPage.drawText(`Estimate Name: ${quotationData.estimateTitle}`, {
    font: timesFont,
    color: rgb(0, 0, 0),
    x: 50,
    maxWidth: ((PAGE_WIDTH - 40) * 2) / 3 - 40,
    y: PAGE_HEIGHT - usedHeight - 350,
    size: TEXT_SIZE,
  })

  currentPage.drawText(`Description: ${quotationData.estimateDescription}`, {
    font: timesFont,
    color: rgb(0, 0, 0),
    x: 50,
    maxWidth: ((PAGE_WIDTH - 40) * 2) / 3 - 40,
    y: PAGE_HEIGHT - usedHeight - 380,
    size: TEXT_SIZE - 5,
  })
  currentPage.drawText(
    `Product Type: ${quotationData.productType.productsTypeName}`,
    {
      font: timesFont,
      color: rgb(0, 0, 0),

      x: ((PAGE_WIDTH - 60) * 2) / 3 + 30,
      maxWidth: PAGE_WIDTH - ((PAGE_WIDTH - 60) * 2) / 3 - 80,
      y: PAGE_HEIGHT - usedHeight - 350,
      size: TEXT_SIZE - 5,
    },
  )

  currentPage.drawText(`Product: ${quotationData.product.productName}`, {
    font: timesFont,
    color: rgb(0, 0, 0),
    x: ((PAGE_WIDTH - 60) * 2) / 3 + 30,
    maxWidth: PAGE_WIDTH - ((PAGE_WIDTH - 60) * 2) / 3 - 80,
    y: PAGE_HEIGHT - usedHeight - 380,
    size: TEXT_SIZE - 5,
  })

  usedHeight += 70
  return usedHeight
}

function drawVariationsTable(
  pdfDoc: PDFDocument,
  currentPage: PDFPage,
  usedHeight: number,
  quotationData: any,
  helveticaFont: any,
  timesFont: any,
  helveticaBoldFont: any,
) {
  quotationData.variations.forEach((variation: any, index: number) => {
    let insideInitialHeight = usedHeight

    let checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
    if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight

    currentPage.drawText(
      `${variation.variationTitle} - ${quotationData.product.productName}`,
      {
        x: 40,
        y: PAGE_HEIGHT - usedHeight - 20,
        size: TEXT_SIZE,
      },
    )
    usedHeight += TEXT_SIZE + 25

    checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
    if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight

    const text = `Additional Notes: ${variation.variationNotes ? variation.variationNotes : 'None'}`
    const textWidth = helveticaFont.widthOfTextAtSize(text, TEXT_SIZE - 10)
    const textHeightFactor = textWidth / (PAGE_WIDTH / 2 - 40) + 1
    currentPage.drawText(
      `Additional Notes: ${variation.variationNotes ? variation.variationNotes : ''}`,
      {
        x: 40,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH / 2 - 40,
      },
    )
    usedHeight += TEXT_SIZE * textHeightFactor

    checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
    if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight

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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Cover Details`, {
        x: 60,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 60,
        font: helveticaBoldFont,
      })

      usedHeight += TEXT_SIZE + 5
    } else {
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Sheet Details`, {
        x: 60,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 60,
        font: helveticaBoldFont,
      })

      usedHeight += TEXT_SIZE + 5
    }

    checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight
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

    // checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
    // currentPage = checkHeightResult.currentPage
    // usedHeight = checkHeightResult.usedHeight

    // currentPage.drawText(`Pages: ${variation.coverPages}`, {
    //   x: 80,
    //   y: PAGE_HEIGHT - usedHeight,
    //   size: TEXT_SIZE - 5,
    //   maxWidth: PAGE_WIDTH - 80,
    // })
    // usedHeight += TEXT_SIZE

    checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight
    currentPage.drawText(`Grammage: ${variation.coverGrammage} GSM`, {
      x: 80,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 5,
      maxWidth: PAGE_WIDTH - 80,
    })
    usedHeight += TEXT_SIZE

    checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight
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

    checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight
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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Primary Text Details`, {
        x: 60,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 60,
        font: helveticaBoldFont,
      })

      usedHeight += TEXT_SIZE + 5

      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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

      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Pages: ${variation.textPages}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE

      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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
        checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
        currentPage = checkHeightResult.currentPage
        usedHeight = checkHeightResult.usedHeight
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

      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Selected Paper: ${result}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE + 5
    }

    if (
      variation.secondaryTextColors &&
      variation.secondaryTextGrammage &&
      variation.secondaryTextPages
    ) {
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Secondary Text Details`, {
        x: 60,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 60,
        font: helveticaBoldFont,
      })

      usedHeight += TEXT_SIZE + 5
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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

      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Pages: ${variation.textPages}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE

      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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
        checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
        currentPage = checkHeightResult.currentPage
        usedHeight = checkHeightResult.usedHeight
        currentPage.drawText(`Lamination: ${variation.textLamination}`, {
          x: 80,
          y: PAGE_HEIGHT - usedHeight,
          size: TEXT_SIZE - 5,
          maxWidth: PAGE_WIDTH - 80,
        })
        usedHeight += TEXT_SIZE
      }
      let selectedPaper = variation.variationCalculations[0].secondaryTextPaper
      let result = selectedPaper
        .replace(/\b\d{2}\.\d{2}x\d{2}\.\d{2}\/\d+gsm\b/, '')
        .trim()

      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Selected Paper: ${result}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE + 5
    }

    checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight
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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Die Cutting(Inside): ${variation.textDieCutting}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.gummingType !== 'None' &&
      variation.gummingType !== undefined &&
      variation.gummingType !== null
    ) {
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Gumming: ${variation.gummingType}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }
    checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight

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
      checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Packaging: ${variation.packagingType}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 5,
        maxWidth: PAGE_WIDTH - 80,
      })
      usedHeight += TEXT_SIZE
    }

    let usedHeightFromTable = drawRatesTable(
      currentPage,
      insideInitialHeight,
      variation,
      helveticaFont,
      helveticaBoldFont,
    )

    usedHeight =
      usedHeightFromTable > usedHeight ? usedHeightFromTable : usedHeight

    currentPage.drawLine({
      start: { x: 40, y: PAGE_HEIGHT - usedHeight },
      end: { x: PAGE_WIDTH - 40, y: PAGE_HEIGHT - usedHeight },
      thickness: 1,
      color: rgb(0, 0, 0),
      opacity: 0.5,
    })
    usedHeight += 10
  })

  return { currentPage, usedHeight }
}

function drawFooter(
  currentPage: PDFPage,
  usedHeight: number,
  timesFont: any,
  timesFontBold: any,
  pdfDoc: PDFDocument,
  quotationData: any,
) {
  let checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight
  currentPage.drawText(
    `This is a computer generated estimate and does not require a signature.`,
    {
      x: 40,
      y: PAGE_HEIGHT - usedHeight - 20,
      size: TEXT_SIZE - 8,
      font: timesFont,
      opacity: 0.8,
    },
  )
  usedHeight += TEXT_SIZE - 8
  checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight
  currentPage.drawText(`Payment Terms`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    font: timesFontBold,
    opacity: 1,
  })

  usedHeight += TEXT_SIZE - 8

  checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  let text = `1. Advance Payment: A 50% advance payment is required before project commoncement. This advance payment is necessary to secure your order and cover initial material and labor costs.`
  let textWidth = timesFont.widthOfTextAtSize(text, TEXT_SIZE - 5)
  let textHeightFactor = textWidth / (PAGE_WIDTH - 120) + 1

  currentPage.drawText(text, {
    x: 80,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    maxWidth: PAGE_WIDTH - 120,
    font: timesFont,
    opacity: 0.8,
    lineHeight: 17,
  })
  usedHeight += textHeightFactor * (TEXT_SIZE - 8)

  checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  text = `2. Final Payment: The remaining balance is due before delivery of the completed job. We will notify you once the job is ready for delivery, and full payment must be received prior to the release of the finished products.`
  ;(textWidth = timesFont.widthOfTextAtSize(text, TEXT_SIZE - 5)),
    (textHeightFactor = textWidth / (PAGE_WIDTH - 120) + 1)

  currentPage.drawText(text, {
    x: 80,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    maxWidth: PAGE_WIDTH - 120,
    font: timesFont,
    opacity: 0.8,
    lineHeight: 17,
  })
  usedHeight += textHeightFactor * (TEXT_SIZE - 8)

  checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight
  currentPage.drawText(`GST & Freight`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    font: timesFontBold,
    opacity: 1,
  })

  usedHeight += TEXT_SIZE - 8

  checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  text = `All rates mentioned above are exclusive of GST and freight charges. Applicable GST and freight costs will be added to the total amount payable.`
  ;(textWidth = timesFont.widthOfTextAtSize(text, TEXT_SIZE - 5)),
    (textHeightFactor = textWidth / (PAGE_WIDTH - 120) + 1)

  currentPage.drawText(text, {
    x: 80,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    maxWidth: PAGE_WIDTH - 120,
    font: timesFont,
    opacity: 0.8,
    lineHeight: 17,
  })
  usedHeight += textHeightFactor * (TEXT_SIZE - 8)

  checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight
  currentPage.drawText(`Additional T&C`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    font: timesFontBold,
    opacity: 1,
  })
  usedHeight += TEXT_SIZE - 8

  checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  text = `1. Delivery Schedule: Delivery dates provided are estimates and may be subject to change due to unforeseen circumstances such as equipment failure, natural disasters, or other unavoidable delays.`
  ;(textWidth = timesFont.widthOfTextAtSize(text, TEXT_SIZE - 5)),
    (textHeightFactor = textWidth / (PAGE_WIDTH - 120) + 1)

  currentPage.drawText(text, {
    x: 80,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    maxWidth: PAGE_WIDTH - 120,
    font: timesFont,
    opacity: 0.8,
    lineHeight: 17,
  })
  usedHeight += textHeightFactor * (TEXT_SIZE - 8)

  checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  text = `2. Quality Assurance: We strive to maintain high-quality standards in all our products. Should you find any defects or issues with our workmanship, please notify us within 2 days of receipt for resolution.`
  ;(textWidth = timesFont.widthOfTextAtSize(text, TEXT_SIZE - 5)),
    (textHeightFactor = textWidth / (PAGE_WIDTH - 120) + 1)

  currentPage.drawText(text, {
    x: 80,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    maxWidth: PAGE_WIDTH - 120,
    font: timesFont,
    opacity: 0.8,
    lineHeight: 17,
  })
  usedHeight += textHeightFactor * (TEXT_SIZE - 8)

  usedHeight += 20

  checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  let salesRepDetails = `${quotationData.salesRep.salesRepName}\n${quotationData.salesRep.salesRepEmail}\n${quotationData.salesRep.salesRepMobile}`

  currentPage.drawText(`Excel Printers Private Limited`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    maxWidth: PAGE_WIDTH / 4,
    font: timesFontBold,
    opacity: 0.8,
    lineHeight: 20,
  })
  usedHeight += TEXT_SIZE - 8

  text = `07AABCE1085B1Z6\nA/82, Third Floor, Naraina Industrial Area Phase 1, New Delhi, Delhi - 110028\n`

  currentPage.drawText(text, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    maxWidth: PAGE_WIDTH / 4,
    font: timesFont,
    opacity: 0.8,
    lineHeight: 20,
  })
  usedHeight += TEXT_SIZE * 3

  checkHeightResult = checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  currentPage.drawText(salesRepDetails, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    maxWidth: PAGE_WIDTH / 4,
    font: timesFont,
    opacity: 0.8,
    lineHeight: 20,
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

  usedHeight += TEXT_SIZE * (indexMax + 1)

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

  currentPage.drawRectangle({
    x: PAGE_WIDTH / 2 + 190,
    y: PAGE_HEIGHT - usedHeight,
    width: 210,
    height: usedHeight - initialHeight + 50,
    color: rgb(119 / 255, 221 / 255, 119 / 255),
    opacity: 0.05,
  })

  return usedHeight
}

function checkUsedHeight(
  currentPage: PDFPage,
  usedHeight: number,
  pdfDoc: PDFDocument,
) {
  if (usedHeight > PAGE_HEIGHT - 20) {
    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    return { currentPage: currentPage, usedHeight: 40 }
  } else {
    return { currentPage: currentPage, usedHeight: usedHeight }
  }
}

async function getAllQuotationData(uuid: string) {
  const data = await db.query.estimates.findFirst({
    where: (estimates, { eq }) => eq(estimates.uuid, uuid),
    with: {
      client: true,
      contact: true,
      product: true,
      productType: true,
      salesRep: true,
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
