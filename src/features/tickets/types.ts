export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Ticket {
  id: string
  organizationId: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  assigneeId: string | null
  createdById: string
  createdAt: string
  updatedAt: string
}
