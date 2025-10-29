// Core UI Components
export { Button } from "./button";
export { Card, CardHeader, CardTitle, CardContent } from "./card";

// Buffr UI Components
export { BuffrButton } from "./buttons/BuffrButton";
export { BuffrIconButton } from "./buttons/BuffrIconButton";
export { BuffrActionButton } from "./buttons/BuffrActionButton";

export { BuffrCard, BuffrCardHeader, BuffrCardTitle, BuffrCardContent } from "./cards/BuffrCard";
export { BuffrBadge } from "./feedback/BuffrBadge";

export { BuffrIcon } from "./icons/BuffrIcons";
export type { BuffrIconName } from "./icons/BuffrIcons";

export { BuffrTabs, BuffrTabsList, BuffrTabsTrigger, BuffrTabsContent } from "./tabs/BuffrTabs";

// Form Components
export { BuffrInput } from './forms/BuffrInput';
export { BuffrTextarea } from './forms/BuffrTextarea';
export { BuffrSelect, BuffrSelectTrigger, BuffrSelectValue, BuffrSelectContent, BuffrSelectItem } from './forms/BuffrSelect';

// Card Components
export { BuffrCardBody } from './cards/BuffrCard';

// Placeholder exports for missing components (to prevent build errors)
// These are temporary placeholders - proper components should be created later
export const BuffrLabel = 'label';
export const BuffrAlert = 'div';
export const BuffrToggle = 'input';
export { BuffrTable } from './tables/BuffrTable';
export const BuffrTableHeader = 'thead';
export const BuffrTableRow = 'tr';
export const BuffrTableHead = 'th';
export const BuffrTableBody = 'tbody';
export const BuffrTableCell = 'td';
export const BuffrAlertDescription = 'div';
export const Badge = 'span';
export const Tabs = 'div';
export const TabsList = 'div';
export const TabsTrigger = 'button';
export const TabsContent = 'div';

// Legacy exports for backward compatibility
export { SmartWaitlist } from "./smart-waitlist";