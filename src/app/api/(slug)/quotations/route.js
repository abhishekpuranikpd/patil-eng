import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      customerId,
      subject,
      contactPerson,
      fluidHandled,
      temperature,
      specificGravity,
      viscosity,
      capacity,
      totalHead,
      npsha,
      pumpType,
      bearingBracket,
      npshr,
      speedRpm,
      efficiency,
      powerAbsorbed,
      minFlow,
      maxFlow,
      shutoffHead,
      maxBkw,
      impellerType,
      impellerDia,
      impellerDiaRange,
      suctionNozzleSize,
      dischargeNozzleSize,
      pipeSizes,
      flangeStandardSuc,
      flangeStandardDis,
      casingMaterial,
      shaftMaterial,
      impellerMaterial,
      sleeveMaterial,
      sealMake,
      sealSize,
      sealTypeCode,
      motorMake,
      motorRatingFrame,
      pumpPrice,
      baseFramePrice,
      couplingPrice,
      motorPrice,
      quantity,
      taxes,
      paymentTerms,
      deliveryTerms,
      deliveryPeriod,
      transportation,
      notes,
    } = body

    if (!customerId || !subject) {
      return NextResponse.json({ error: 'Customer ID and subject are required' }, { status: 400 })
    }

    const lastQuotation = await db.quotation.findFirst({
      orderBy: { quotationNo: 'desc' },
    })

    const nextQuotationNo = lastQuotation ? (lastQuotation.quotationNo + 1).toString() : '1';


    const quotation = await db.quotation.create({
      data: {
        customerId,
        quotationNo: nextQuotationNo,
        subject,
        contactPerson,
        fluidHandled,
        temperature,
        specificGravity,
        viscosity,
        capacity,
        totalHead,
        npsha,
        pumpType,
        bearingBracket,
        npshr,
        speedRpm,
        efficiency,
        powerAbsorbed,
        minFlow,
        maxFlow,
        shutoffHead,
        maxBkw,
        impellerType,
        impellerDia,
        impellerDiaRange,
        suctionNozzleSize,
        dischargeNozzleSize,
        pipeSizes,
        flangeStandardSuc,
        flangeStandardDis,
        casingMaterial,
        shaftMaterial,
        impellerMaterial,
        sleeveMaterial,
        sealMake,
        sealSize,
        sealTypeCode,
        motorMake,
        motorRatingFrame,
        pumpPrice,
        baseFramePrice,
        couplingPrice,
        motorPrice,
        quantity,
        taxes,
        paymentTerms,
        deliveryTerms,
        deliveryPeriod,
        transportation,
        notes,
      },
    })

    return NextResponse.json(quotation, { status: 201 })
  } catch (error) {
    console.error('Quotation creation failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
