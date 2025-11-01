/**
 * Buffr Host UI Components
 *
 * Unified DaisyUI 5 component system with Nude brand identity
 * Features: Warm professional aesthetic, accessibility, TypeScript support
 */

// Core Buffr Components (DaisyUI 5)
export * from './buffr-components';

// Buffr Icons
export { BuffrIcon } from './icons/BuffrIcons';
export type { BuffrIconName } from './icons/BuffrIcons';

// Enhanced Components (updated to use Buffr components)
export { StarRating } from './star-rating';
export { SmartWaitlist } from './smart-waitlist';
export { default as KpiCard } from './kpi-card';
export { default as StatCard } from './stat-card';
export { default as StatusBadge } from './status-badge';
export { default as PageHeader } from './page-header';
export { default as DataTable } from './data-table';
export { default as LoadingStates } from './loading-states';

// Backward compatibility aliases
export {
  BuffrButton as Button,
  BuffrCard as Card,
  BuffrCardBody as CardBody,
  BuffrCardHeader as CardHeader,
  BuffrCardContent as CardContent,
  BuffrCardTitle as CardTitle,
  BuffrCardActions as CardActions,
  BuffrInput as Input,
  BuffrBadge as Badge,
  BuffrModal as Modal,
  BuffrModalBox as ModalBox,
  BuffrModalAction as ModalAction,
  BuffrModalBackdrop as ModalBackdrop,
  BuffrTabs as Tabs,
  BuffrTabsList as TabsList,
  BuffrTabsTrigger as TabsTrigger,
  BuffrTabsContent as TabsContent,
  BuffrTable as Table,
  BuffrTableHeader as TableHeader,
  BuffrTableBody as TableBody,
  BuffrTableRow as TableRow,
  BuffrTableHead as TableHead,
  BuffrTableCell as TableCell,
  BuffrAlert as Alert,
  BuffrAlertDescription as AlertDescription,
  // New Property Management Components
} from './buffr-components';

// Import Buffr components for DaisyUI namespace
import {
  BuffrButton,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardContent,
  BuffrCardTitle,
  BuffrCardActions,
  BuffrInput,
  BuffrBadge,
  BuffrModal,
  BuffrModalBox,
  BuffrModalAction,
  BuffrModalBackdrop,
  BuffrTabs,
  BuffrTabsList,
  BuffrTabsTrigger,
  BuffrTabsContent,
  BuffrTable,
  BuffrTableHeader,
  BuffrTableBody,
  BuffrTableRow,
  BuffrTableHead,
  BuffrTableCell,
  BuffrSelect,
  BuffrSelectTrigger,
  BuffrSelectValue,
  BuffrSelectContent,
  BuffrSelectItem,
  BuffrAlert,
  BuffrAlertDescription,
  // New Property Management Components
} from './buffr-components';
import { BuffrIcon } from './icons/BuffrIcons';

// DaisyUI namespace for backward compatibility
export const DaisyUI = {
  // Re-export all Buffr components under DaisyUI namespace
  Button: BuffrButton,
  Card: BuffrCard,
  CardBody: BuffrCardBody,
  CardHeader: BuffrCardHeader,
  CardContent: BuffrCardContent,
  CardTitle: BuffrCardTitle,
  CardActions: BuffrCardActions,
  Input: BuffrInput,
  Badge: BuffrBadge,
  Modal: BuffrModal,
  ModalBox: BuffrModalBox,
  ModalAction: BuffrModalAction,
  ModalBackdrop: BuffrModalBackdrop,
  Tabs: BuffrTabs,
  TabsList: BuffrTabsList,
  TabsTrigger: BuffrTabsTrigger,
  TabsContent: BuffrTabsContent,
  Table: BuffrTable,
  TableHeader: BuffrTableHeader,
  TableBody: BuffrTableBody,
  TableRow: BuffrTableRow,
  TableHead: BuffrTableHead,
  TableCell: BuffrTableCell,
  Select: BuffrSelect,
  SelectTrigger: BuffrSelectTrigger,
  SelectValue: BuffrSelectValue,
  SelectContent: BuffrSelectContent,
  SelectItem: BuffrSelectItem,
  Alert: BuffrAlert,
  AlertDescription: BuffrAlertDescription,
  Icon: BuffrIcon,
};
