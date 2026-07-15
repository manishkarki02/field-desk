export interface Organization {
  id: string
  name: string
  createdAt: string
}

export interface OrganizationWithStats extends Organization {
  userCount: number
  ticketCount: number
}
