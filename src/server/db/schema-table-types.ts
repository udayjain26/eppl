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
