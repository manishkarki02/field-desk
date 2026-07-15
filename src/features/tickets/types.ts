export const ticketStatuses = [
  'open',
  'in_progress',
  'resolved',
  'closed',
] as const
export type TicketStatus = (typeof ticketStatuses)[number]

export const ticketPriorities = ['low', 'medium', 'high', 'urgent'] as const
export type TicketPriority = (typeof ticketPriorities)[number]

export const ticketStatusLabels: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

export const ticketPriorityLabels: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

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
