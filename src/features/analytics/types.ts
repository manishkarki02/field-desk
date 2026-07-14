import type { TicketPriority, TicketStatus } from '@/features/tickets'

export interface TicketAnalytics {
  total: number
  byStatus: Record<TicketStatus, number>
  byPriority: Record<TicketPriority, number>
  byAssignee: Array<{ userId: string; name: string; count: number }>
}
