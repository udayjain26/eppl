export type Client = {
  uuid: string
  clientFullName: string
  clientNickName: string
  gstin: string | null
  isNewClient: boolean
  clientAddressLine1: string | null
  clientAddressLine2: string | null
  clientAddressCity: string | null
  clientAddressState: string | null
  clientAddressPincode: string | null
  clientWebsite: string | null
  clientIndustry: string | null
  createdAt: Date
  updatedAt: Date
  createdBy: string | null
  updatedBy: string | null
}

export type Contact = {
  uuid: string
  clientUuid: string
  contactFirstName: string
  contactLastName: string
  contactEmail: string
  contactMobile: string
  contactDesignation: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string | null
  updatedBy: string | null
}

export type EstimateTableRow = {
  uuid: string
  clientUuid: string
  contactUuid: string
  estimateProductUuid: string
  estimateProductTypeUuid: string
  estimateNumber: string | number
  estimateTitle: string
  estimateDescription: string
  estimateStatus: string
  estimateStage: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
  client: { clientNickName: string }
  contact: {
    contactFirstName: string
    contactLastName: string
    contactFullName: string
    contactEmail: string
    contactMobile: string
    contactDesignation: string
    isActive: true
  }
  productType: { productsTypeName: string }
  product: { productName: string }
  salesRep: { salesRepName: string }
}
