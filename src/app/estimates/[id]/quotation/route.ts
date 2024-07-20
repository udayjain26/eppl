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
import fontkit from '@pdf-lib/fontkit'
import { use } from 'react'

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

    const lightSansFontPath = path.join(
      process.cwd(),
      'public',
      'fonts',
      'Montserrat-Light.ttf',
    )
    const mediumSansFontPath = path.join(
      process.cwd(),
      'public',
      'fonts',
      'Montserrat-Medium.ttf',
    )
    const boldSansFontPath = path.join(
      process.cwd(),
      'public',
      'fonts',
      'Montserrat-Bold.ttf',
    )

    const lightSerifFontPath = path.join(
      process.cwd(),
      'public',
      'fonts',
      'EBGaramond-Regular.ttf',
    )
    const mediumSerifFontPath = path.join(
      process.cwd(),
      'public',
      'fonts',
      'EBGaramond-Medium.ttf',
    )
    const boldSerifFontPath = path.join(
      process.cwd(),
      'public',
      'fonts',
      'EBGaramond-Bold.ttf',
    )

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
    pdfDoc.registerFontkit(fontkit)
    const lightSansFontBytes = await fs.promises.readFile(lightSansFontPath)
    const mediumSansFontBytes = await fs.promises.readFile(mediumSansFontPath)
    const boldSansFontBytes = await fs.promises.readFile(boldSansFontPath)
    const lightSerifFontBytes = await fs.promises.readFile(lightSerifFontPath)
    const mediumSerifFontBytes = await fs.promises.readFile(mediumSerifFontPath)
    const boldSerifFontBytes = await fs.promises.readFile(boldSerifFontPath)

    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    const pngImage = await pdfDoc.embedPng(pngImageBytes)

    const lightSansFont = await pdfDoc.embedFont(lightSansFontBytes)
    const mediumSansFont = await pdfDoc.embedFont(mediumSansFontBytes)
    const boldSansFont = await pdfDoc.embedFont(boldSansFontBytes)
    const lightSerifFont = await pdfDoc.embedFont(lightSerifFontBytes)
    const mediumSerifFont = await pdfDoc.embedFont(mediumSerifFontBytes)
    const boldSerifFont = await pdfDoc.embedFont(boldSerifFontBytes)

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

    await drawPageBackgrounds(currentPage, pdfDoc)

    // Draw the PNG image near the top left corner of the JPG image
    const pngDims = pngImage.scale(0.1)
    currentPage.drawImage(pngImage, {
      x: 40,
      y: PAGE_HEIGHT - pngDims.height,
      width: pngDims.width,
      height: pngDims.height,
    })

    const thirtyYearsImagePath = path.join(
      process.cwd(),
      'public',
      '30-years.png',
    )
    const thirtyYearsImageBytes = fs.readFileSync(thirtyYearsImagePath)
    const thirtyYearsImage = await pdfDoc.embedPng(thirtyYearsImageBytes)
    const thirtyYearsDims = thirtyYearsImage.scale(0.2)

    currentPage.drawImage(thirtyYearsImage, {
      x: PAGE_WIDTH - 150,
      y: PAGE_HEIGHT - 150,
      width: thirtyYearsDims.width,
      height: thirtyYearsDims.height,
    })

    drawDatesData(currentPage, usedHeight, quotationData, lightSansFont)
    usedHeight += pngDims.height

    usedHeight = drawEstimateDetails(
      currentPage,
      usedHeight,
      quotationData,
      lightSerifFont,
      mediumSerifFont,
      boldSerifFont,
    )

    let variationTableResult = await drawVariationsTable(
      pdfDoc,
      currentPage,
      usedHeight,
      quotationData,
      lightSansFont,
      mediumSansFont,
      boldSansFont,
    )

    currentPage = variationTableResult.currentPage
    usedHeight = variationTableResult.usedHeight

    await drawFooter(
      currentPage,
      usedHeight,
      pdfDoc,
      quotationData,
      lightSerifFont,
      mediumSerifFont,
      boldSerifFont,
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
    console.error(error)
    return new NextResponse('Failed to generate PDF', { status: 500 })
  }
}

function drawDatesData(
  currentPage: PDFPage,
  usedHeight: number,
  quotationData: any,
  lightSansFont: any,
) {
  currentPage.drawText(`Estimate uuid: ${quotationData.uuid}`, {
    x: PAGE_WIDTH - 450,
    y: PAGE_HEIGHT - 15,
    size: TEXT_SIZE - 10,
    font: lightSansFont,
    // maxWidth: PAGE_WIDTH - 40,
  })

  return usedHeight
}

function drawEstimateDetails(
  currentPage: PDFPage,
  usedHeight: number,
  quotationData: any,
  lightSerifFont: any,
  mediumSerifFont: any,
  boldSerifFont: any,
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
    font: boldSerifFont,
  })
  usedHeight = usedHeight + TEXT_SIZE + 10
  currentPage.drawText(
    `${clientGSTIN}${clientAddressLine1}${clientAddressLine2}${clientCity}${clientState}${clientPincode}`,
    {
      x: 40,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 5,
      maxWidth: ((PAGE_WIDTH - 40) * 2) / 3 - 40,
      font: lightSerifFont,
    },
  )
  usedHeight = usedHeight + TEXT_SIZE + 40

  currentPage.drawText(`${contactFirstName}${contactLastName}`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight,
    size: TEXT_SIZE,
    maxWidth: ((PAGE_WIDTH - 60) * 2) / 3,
    font: boldSerifFont,
  })
  usedHeight = usedHeight + TEXT_SIZE + 10
  currentPage.drawText(`${contactMobile}${contactEmail}`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight,
    size: TEXT_SIZE - 5,
    maxWidth: ((PAGE_WIDTH - 60) * 2) / 3,
    font: lightSerifFont,
  })

  usedHeight = usedHeight + TEXT_SIZE + 10

  currentPage.drawText(
    `Quotation Number: ${quotationData.estimateNumber.toString().padStart(6, '0')}`,
    {
      x: ((PAGE_WIDTH - 40) * 2) / 3 - 40 + 150,
      y: PAGE_HEIGHT - initHeight,
      size: TEXT_SIZE - 2,
      maxWidth: PAGE_WIDTH - 40,
      font: mediumSerifFont,
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
      font: lightSerifFont,
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
      font: lightSerifFont,
    },
  )
  initHeight += TEXT_SIZE

  initHeight += 40
  currentPage.drawText(`Title: ${quotationData.estimateTitle}`, {
    x: ((PAGE_WIDTH - 40) * 2) / 3 - 40 + 150,
    y: PAGE_HEIGHT - initHeight,
    size: TEXT_SIZE - 5,
    maxWidth: PAGE_WIDTH / 4 - 40,
    font: lightSerifFont,
  })

  usedHeight += 50

  return usedHeight
}

// function drawQuotationNumberRow(
//   currentPage: PDFPage,
//   usedHeight: number,
//   quotationData: any,
// ) {
//   currentPage.drawRectangle({
//     x: 30,
//     y: PAGE_HEIGHT - usedHeight - 300,
//     width: PAGE_WIDTH - 60,
//     height: 240,
//     color: rgb(0.95, 0.45, 0.2),
//     opacity: 0.35,
//   })

//   currentPage.drawRectangle({
//     x: 30,
//     y: PAGE_HEIGHT - usedHeight - 410,
//     width: PAGE_WIDTH - 60,
//     height: 100,
//     color: rgb(0, 0, 0),
//     opacity: 0.1,
//   })
//   currentPage.drawText(`Estimate Name: ${quotationData.estimateTitle}`, {
//     color: rgb(0, 0, 0),
//     x: 50,
//     maxWidth: ((PAGE_WIDTH - 40) * 2) / 3 - 40,
//     y: PAGE_HEIGHT - usedHeight - 350,
//     size: TEXT_SIZE,
//   })

//   currentPage.drawText(`Description: ${quotationData.estimateDescription}`, {
//     color: rgb(0, 0, 0),
//     x: 50,
//     maxWidth: ((PAGE_WIDTH - 40) * 2) / 3 - 40,
//     y: PAGE_HEIGHT - usedHeight - 380,
//     size: TEXT_SIZE - 5,
//   })
//   currentPage.drawText(
//     `Product Type: ${quotationData.productType.productsTypeName}`,
//     {
//       color: rgb(0, 0, 0),

//       x: ((PAGE_WIDTH - 60) * 2) / 3 + 30,
//       maxWidth: PAGE_WIDTH - ((PAGE_WIDTH - 60) * 2) / 3 - 80,
//       y: PAGE_HEIGHT - usedHeight - 350,
//       size: TEXT_SIZE - 5,
//     },
//   )

//   currentPage.drawText(`Product: ${quotationData.product.productName}`, {
//     color: rgb(0, 0, 0),
//     x: ((PAGE_WIDTH - 60) * 2) / 3 + 30,
//     maxWidth: PAGE_WIDTH - ((PAGE_WIDTH - 60) * 2) / 3 - 80,
//     y: PAGE_HEIGHT - usedHeight - 380,
//     size: TEXT_SIZE - 5,
//   })

//   usedHeight += 70
//   return usedHeight
// }

async function drawVariationsTable(
  pdfDoc: PDFDocument,
  currentPage: PDFPage,
  usedHeight: number,
  quotationData: any,
  lightSansFont: any,
  mediumSansFont: any,
  boldSansFont: any,
) {
  for (const variation of quotationData.variations) {
    let insideInitialHeight = usedHeight
    let checkHeightResult = await checkUsedHeight(
      currentPage,
      usedHeight,
      pdfDoc,
    )
    if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight

    currentPage.drawText(
      `${variation.variationTitle} - ${quotationData.product.productName}`,
      {
        x: 40,
        y: PAGE_HEIGHT - usedHeight - 20,
        size: TEXT_SIZE,
        font: mediumSansFont,
      },
    )
    usedHeight += TEXT_SIZE + 25

    checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
    if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight

    const text = `Additional Notes: ${variation.variationNotes ? variation.variationNotes : 'None'}`
    const textWidth = lightSansFont.widthOfTextAtSize(text, TEXT_SIZE - 10)
    const textHeightFactor = textWidth / (PAGE_WIDTH / 2 - 40) + 1
    currentPage.drawText(
      `Additional Notes: ${variation.variationNotes ? variation.variationNotes : ''}`,
      {
        x: 40,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH / 2 - 40,
        font: lightSansFont,
      },
    )
    usedHeight += TEXT_SIZE * textHeightFactor

    checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
    if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight

    currentPage.drawText(`Size Details`, {
      x: 60,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 10,
      maxWidth: PAGE_WIDTH - 60,
      font: boldSansFont,
    })

    usedHeight += TEXT_SIZE

    if (
      variation.closeSizeName &&
      variation.closeSizeLength &&
      variation.closeSizeWidth
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(
        `Close Size: ${Number(variation.closeSizeLength / 25.4).toFixed(2)}in x ${Number(variation.closeSizeWidth / 25.4).toFixed(2)}in`,
        {
          x: 80,
          y: PAGE_HEIGHT - usedHeight,
          size: TEXT_SIZE - 10,
          maxWidth: PAGE_WIDTH - 80,
          font: lightSansFont,
        },
      )
      usedHeight += TEXT_SIZE + 5
    }

    if (
      variation.openSizeName &&
      variation.openSizeLength &&
      variation.openSizeWidth
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(
        `Open Size: ${Number(variation.openSizeLength / 25.4).toFixed(2)}in x ${Number(variation.openSizeWidth / 25.4).toFixed(2)}in`,
        {
          x: 80,
          y: PAGE_HEIGHT - usedHeight,
          size: TEXT_SIZE - 10,
          maxWidth: PAGE_WIDTH - 80,
          font: lightSansFont,
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
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Cover Details`, {
        x: 60,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 60,
        font: boldSansFont,
      })

      usedHeight += TEXT_SIZE + 5
    } else {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Sheet Details`, {
        x: 60,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 60,
        font: boldSansFont,
      })

      usedHeight += TEXT_SIZE + 5
    }

    checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight
    currentPage.drawText(
      `Colors: ${variation.coverFrontColors} + ${variation.coverBackColors}`,
      {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      },
    )
    usedHeight += TEXT_SIZE

    let selectedPaper = variation.variationCalculations[0].coverPaper
    let result =
      `${variation.coverGrammage} GSM ` +
      selectedPaper.replace(/\b\d{2}\.\d{2}x\d{2}\.\d{2}\/\d+gsm\b/, '').trim()

    checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight
    currentPage.drawText(`Selected Paper: ${result}`, {
      x: 80,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 10,
      maxWidth: PAGE_WIDTH - 80,
      font: lightSansFont,
    })
    usedHeight += TEXT_SIZE

    checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight
    currentPage.drawText(`Lamination: ${variation.coverLamination}`, {
      x: 80,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 10,
      maxWidth: PAGE_WIDTH - 80,
      font: lightSansFont,
    })
    usedHeight += TEXT_SIZE

    if (
      (quotationData.productType.productsTypeName === 'Catalogs' ||
        quotationData.productType.productsTypeName === 'Books' ||
        quotationData.productType.productsTypeName === 'Annual Reports' ||
        quotationData.productType.productsTypeName === 'Brochures' ||
        quotationData.productType.productsTypeName === "Children's Books" ||
        quotationData.productType.productsTypeName === 'Magazines' ||
        quotationData.productType.productsTypeName === 'Diaries' ||
        quotationData.productType.productsTypeName === 'Notebooks' ||
        quotationData.productType.productsTypeName === 'Pads') &&
      variation.textColors &&
      variation.textGrammage &&
      variation.textPages
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Text Details`, {
        x: 60,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 60,
        font: boldSansFont,
      })

      usedHeight += TEXT_SIZE + 5

      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(
        `Colors: ${variation.textColors} + ${variation.textColors}`,
        {
          x: 80,
          y: PAGE_HEIGHT - usedHeight,
          size: TEXT_SIZE - 10,
          maxWidth: PAGE_WIDTH - 80,
          font: lightSansFont,
        },
      )
      usedHeight += TEXT_SIZE

      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Pages: ${variation.textPages}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE

      let selectedPaper = variation.variationCalculations[0].textPaper
      let result =
        `${variation.textGrammage} GSM ` +
        selectedPaper
          .replace(/\b\d{2}\.\d{2}x\d{2}\.\d{2}\/\d+gsm\b/, '')
          .trim()

      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Selected Paper: ${result}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.textLamination !== 'None' &&
      variation.textLamination !== undefined &&
      variation.textLamination !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Lamination: ${variation.textLamination}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }

    if (
      variation.secondaryTextColors &&
      variation.secondaryTextGrammage &&
      variation.secondaryTextPages
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Secondary Text Details`, {
        x: 60,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 60,
        font: boldSansFont,
      })

      usedHeight += TEXT_SIZE + 5
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(
        `Colors: ${variation.secondaryTextColors} + ${variation.secondaryTextColors}`,
        {
          x: 80,
          y: PAGE_HEIGHT - usedHeight,
          size: TEXT_SIZE - 10,
          maxWidth: PAGE_WIDTH - 80,
          font: lightSansFont,
        },
      )
      usedHeight += TEXT_SIZE

      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Pages: ${variation.secondaryTextPages}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE

      let selectedPaper = variation.variationCalculations[0].secondaryTextPaper
      let result =
        ` ${variation.secondaryTextGrammage} GSM` +
        selectedPaper
          .replace(/\b\d{2}\.\d{2}x\d{2}\.\d{2}\/\d+gsm\b/, '')
          .trim()

      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Selected Paper: ${result}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.textLamination !== 'None' &&
      variation.textLamination !== undefined &&
      variation.textLamination !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Lamination: ${variation.secondaryTextLamination}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }
    checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight
    currentPage.drawText(`Fabrication Details`, {
      x: 60,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 10,
      maxWidth: PAGE_WIDTH - 60,
      font: boldSansFont,
    })

    usedHeight += TEXT_SIZE + 5

    if (
      variation.binding !== 'None' &&
      variation.binding !== undefined &&
      variation.binding !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Binding: ${variation.binding}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.coverUV !== 'None' &&
      variation.coverUV !== undefined &&
      variation.coverUV !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Cover UV: ${variation.coverUV}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.textUV !== 'None' &&
      variation.textUV !== undefined &&
      variation.textUV !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Text UV: ${variation.textUV}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.coverCoating !== 'None' &&
      variation.coverCoating !== undefined &&
      variation.coverCoating !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Cover Coating: ${variation.coverCoating}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.textCoating !== 'None' &&
      variation.textCoating !== undefined &&
      variation.textCoating !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Text Coating: ${variation.textCoating}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.coverEmbossing !== 'None' &&
      variation.coverEmbossing !== undefined &&
      variation.coverEmbossing !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Cover Embossing: ${variation.coverEmbossing}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.coverFoiling !== 'None' &&
      variation.coverFoiling !== undefined &&
      variation.coverFoiling !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Cover Foiling: ${variation.coverFoiling}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }

    if (
      variation.vdp !== 'None' &&
      variation.vdp !== undefined &&
      variation.vdp !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`VDP: ${variation.vdp}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.coverDieCutting !== 'None' &&
      variation.coverDieCutting !== undefined &&
      variation.coverDieCutting !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Die Cutting(Outer): ${variation.coverDieCutting}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.textDieCutting !== 'None' &&
      variation.textDieCutting !== undefined &&
      variation.textDieCutting !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Die Cutting(Inner): ${variation.textDieCutting}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.gummingType !== 'None' &&
      variation.gummingType !== undefined &&
      variation.gummingType !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Gumming: ${variation.gummingType}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }
    if (
      variation.makingProcess !== 'None' &&
      variation.makingProcess !== undefined &&
      variation.makingProcess !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Making: ${variation.makingProcess}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }

    checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
    currentPage = checkHeightResult.currentPage
    usedHeight = checkHeightResult.usedHeight

    currentPage.drawText(`Packaging Details`, {
      x: 60,
      y: PAGE_HEIGHT - usedHeight,
      size: TEXT_SIZE - 10,
      maxWidth: PAGE_WIDTH - 60,
      font: boldSansFont,
    })

    usedHeight += TEXT_SIZE + 5

    if (
      variation.packagingType !== 'None' &&
      variation.packagingType !== undefined &&
      variation.packagingType !== null
    ) {
      checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
      if (currentPage !== checkHeightResult.currentPage) insideInitialHeight = 0
      currentPage = checkHeightResult.currentPage
      usedHeight = checkHeightResult.usedHeight
      currentPage.drawText(`Packaging: ${variation.packagingType}`, {
        x: 80,
        y: PAGE_HEIGHT - usedHeight,
        size: TEXT_SIZE - 10,
        maxWidth: PAGE_WIDTH - 80,
        font: lightSansFont,
      })
      usedHeight += TEXT_SIZE
    }

    let usedHeightFromTable = await drawRatesTable(
      currentPage,
      insideInitialHeight,
      variation,
      lightSansFont,
      mediumSansFont,
      boldSansFont,
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
  }

  return { currentPage, usedHeight }
}

async function drawFooter(
  currentPage: PDFPage,
  usedHeight: number,
  pdfDoc: PDFDocument,
  quotationData: any,
  lightSerifFont: any,
  mediumSerifFont: any,
  boldSerifFont: any,
) {
  let checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  currentPage.drawText(
    `This is a computer generated estimate and does not require a signature.`,
    {
      x: 40,
      y: PAGE_HEIGHT - usedHeight - 20,
      size: TEXT_SIZE - 8,
      opacity: 0.8,
      font: lightSerifFont,
    },
  )
  usedHeight += TEXT_SIZE

  checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  let text = `Payment Terms: A 50% advance payment is required with an approved purchase order and The remaining balance is due before delivery of the completed job.`
  let textWidth = mediumSerifFont.widthOfTextAtSize(text, TEXT_SIZE - 5)
  let textHeightFactor = textWidth / (PAGE_WIDTH - 120)

  currentPage.drawText(text, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    opacity: 1,
    maxWidth: PAGE_WIDTH - 120,
    lineHeight: 17,
    font: mediumSerifFont,
  })
  usedHeight += textHeightFactor * (TEXT_SIZE - 5)

  checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight
  currentPage.drawText(
    `GST & Freight: GST and freight charges are extra as applicable.`,
    {
      x: 40,
      y: PAGE_HEIGHT - usedHeight - 20,
      size: TEXT_SIZE - 8,
      maxWidth: PAGE_WIDTH - 120,
      opacity: 1,
      font: mediumSerifFont,
    },
  )

  usedHeight += TEXT_SIZE

  checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  currentPage.drawText(`Additional T&C`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    opacity: 1,
    font: mediumSerifFont,
  })
  usedHeight += TEXT_SIZE

  checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  text = `1. Delivery dates provided are estimates and may be subject to change due to unforeseen circumstances.`
  ;(textWidth = lightSerifFont.widthOfTextAtSize(text, TEXT_SIZE - 5)),
    (textHeightFactor = textWidth / (PAGE_WIDTH - 120) + 1)

  currentPage.drawText(text, {
    x: 80,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    maxWidth: PAGE_WIDTH - 120,
    opacity: 0.8,
    lineHeight: 17,
    font: lightSerifFont,
  })
  usedHeight += textHeightFactor * (TEXT_SIZE - 8)

  checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  text = `2. Quality Assurance: We strive to maintain high-quality standards in all our products. If you notice any defects or issues with our workmanship, please notify us within 2 days of receipt for resolution.`
  ;(textWidth = lightSerifFont.widthOfTextAtSize(text, TEXT_SIZE - 5)),
    (textHeightFactor = textWidth / (PAGE_WIDTH - 120) + 1)

  currentPage.drawText(text, {
    x: 80,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 8,
    maxWidth: PAGE_WIDTH - 120,
    opacity: 0.8,
    lineHeight: 17,
    font: lightSerifFont,
  })
  usedHeight += textHeightFactor * (TEXT_SIZE - 8)

  usedHeight += 40

  checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  let salesRepDetails = `${quotationData.salesRep.salesRepName}\n${quotationData.salesRep.salesRepEmail}\n${quotationData.salesRep.salesRepMobile}`

  checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight
  currentPage.drawText(`Warm Regards,\n`, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 3,
    maxWidth: PAGE_WIDTH / 4,
    opacity: 0.8,
    lineHeight: 20,
    font: mediumSerifFont,
  })
  usedHeight += TEXT_SIZE * 1.5

  checkHeightResult = await checkUsedHeight(currentPage, usedHeight, pdfDoc)
  currentPage = checkHeightResult.currentPage
  usedHeight = checkHeightResult.usedHeight

  currentPage.drawText(salesRepDetails, {
    x: 40,
    y: PAGE_HEIGHT - usedHeight - 20,
    size: TEXT_SIZE - 3,
    maxWidth: PAGE_WIDTH / 4,
    opacity: 0.8,
    lineHeight: 25,
    font: mediumSerifFont,
  })
  usedHeight += TEXT_SIZE

  const footerImage = path.join(process.cwd(), 'public', 'footer.png')

  const footerBytes = fs.readFileSync(footerImage)

  const footer = await pdfDoc.embedPng(footerBytes)

  const footerDims = footer.scale(0.25)
  currentPage.drawImage(footer, {
    x: PAGE_WIDTH / 2 - footerDims.width / 2,
    y: 0,
    width: footerDims.width,
    height: footerDims.height,
  })

  return usedHeight
}

async function drawRatesTable(
  currentPage: PDFPage,
  usedHeight: number,
  variation: any,
  lightSansFont: any,
  mediumSansFont: any,
  boldSansFont: any,
) {
  const initialHeight = usedHeight + 80
  usedHeight = usedHeight + 50

  currentPage.drawText(`Rates Table`, {
    x: PAGE_WIDTH / 2 + 200,
    y: PAGE_HEIGHT - usedHeight,
    size: TEXT_SIZE - 5,
    font: mediumSansFont,
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
      font: mediumSansFont,
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
      font: mediumSansFont,
    })

    currentPage.drawText(row.rate.toString(), {
      x: PAGE_WIDTH / 2 + headerXPositions[1],
      y: rowYPosition,
      size: TEXT_SIZE - 5,
      font: mediumSansFont,
    })

    usedHeight += TEXT_SIZE - 10
  })

  usedHeight += TEXT_SIZE * (indexMax + 0.5)

  currentPage.drawLine({
    start: { x: PAGE_WIDTH / 2 + 190, y: PAGE_HEIGHT - initialHeight + 20 },
    end: { x: PAGE_WIDTH / 2 + 400, y: PAGE_HEIGHT - initialHeight + 20 },
    thickness: 1,
    color: rgb(112 / 255, 128 / 255, 144 / 255),
  })

  currentPage.drawLine({
    start: { x: PAGE_WIDTH / 2 + 300, y: PAGE_HEIGHT - initialHeight + 20 },
    end: { x: PAGE_WIDTH / 2 + 300, y: PAGE_HEIGHT - usedHeight },
    thickness: 1,
    color: rgb(112 / 255, 128 / 255, 144 / 255),
  })

  currentPage.drawLine({
    start: { x: PAGE_WIDTH / 2 + 190, y: PAGE_HEIGHT - initialHeight + 20 },
    end: { x: PAGE_WIDTH / 2 + 190, y: PAGE_HEIGHT - usedHeight },
    thickness: 1,
    color: rgb(112 / 255, 128 / 255, 144 / 255),
  })

  currentPage.drawLine({
    start: { x: PAGE_WIDTH / 2 + 400, y: PAGE_HEIGHT - initialHeight + 20 },
    end: { x: PAGE_WIDTH / 2 + 400, y: PAGE_HEIGHT - usedHeight },
    thickness: 1,
    color: rgb(112 / 255, 128 / 255, 144 / 255),
  })

  currentPage.drawLine({
    start: { x: PAGE_WIDTH / 2 + 190, y: PAGE_HEIGHT - initialHeight - 5 },
    end: { x: PAGE_WIDTH / 2 + 400, y: PAGE_HEIGHT - initialHeight - 5 },
    thickness: 1,
    color: rgb(112 / 255, 128 / 255, 144 / 255),
  })

  currentPage.drawLine({
    start: { x: PAGE_WIDTH / 2 + 190, y: PAGE_HEIGHT - usedHeight },
    end: { x: PAGE_WIDTH / 2 + 400, y: PAGE_HEIGHT - usedHeight },
    thickness: 1,
    color: rgb(112 / 255, 128 / 255, 144 / 255),
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

async function checkUsedHeight(
  currentPage: PDFPage,
  usedHeight: number,
  pdfDoc: PDFDocument,
) {
  if (usedHeight > PAGE_HEIGHT - 200) {
    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    await drawPageBackgrounds(currentPage, pdfDoc)

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

async function drawPageBackgrounds(currentPage: PDFPage, pdfDoc: PDFDocument) {
  const watermarkImagePath = path.join(process.cwd(), 'public', 'watermark.png')
  const watermarkImageBytes = fs.readFileSync(watermarkImagePath)

  const textureBackgroundImagePath = path.join(
    process.cwd(),
    'public',
    'white-texture.jpg',
  )

  const jpgImageBytes = fs.readFileSync(textureBackgroundImagePath)

  const jpgImage = await pdfDoc.embedJpg(jpgImageBytes)
  const watermarkImage = await pdfDoc.embedPng(watermarkImageBytes)
  const watermarkDims = watermarkImage.scale(0.2)

  currentPage.setLineHeight(25)
  currentPage.drawImage(jpgImage, {
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    opacity: 0.33,
  })

  currentPage.drawImage(watermarkImage, {
    x: PAGE_WIDTH / 2 - watermarkDims.width / 2,
    y: PAGE_HEIGHT / 2 - watermarkDims.height / 2,
    width: watermarkDims.width,
    height: watermarkDims.height,
  })
}
