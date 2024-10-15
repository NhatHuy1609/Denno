'use client'

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'

const Collapsible = CollapsiblePrimitive.Root

const Trigger = CollapsiblePrimitive.CollapsibleTrigger
Trigger.displayName = 'CollapsibleTrigger'

const Content = CollapsiblePrimitive.CollapsibleContent
Content.displayName = 'CollapsibleContent'

export { Collapsible, Trigger, Content }
