import { Badge } from '@/components/ui/badge'
import { PROPERTY_STATUS } from '@/lib/constants'
import type { PropertyStatus } from '@/types/property'

interface PropertyStatusBadgeProps {
  status: PropertyStatus
}

export function PropertyStatusBadge({ status }: PropertyStatusBadgeProps) {
  const variants: Record<PropertyStatus, 'success' | 'warning' | 'muted'> = {
    available: 'success',
    reserved: 'warning',
    completed: 'muted',
  }

  return (
    <Badge variant={variants[status]}>
      {PROPERTY_STATUS[status]}
    </Badge>
  )
}
