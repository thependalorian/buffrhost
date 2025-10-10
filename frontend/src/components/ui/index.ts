/**
 * Universal UI Components Index for Buffr Host Platform
 *
 * Centralized export of all reusable UI components for the entire application.
 * This ensures consistent imports and makes components easily discoverable.
 */

// Core UI Components
export { Button } from "./button";
export { Input } from "./input";
export { Label } from "./label";
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
export { Checkbox } from "./checkbox";
export { Separator } from "./separator";
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
export { Toast } from "./toast";

// Emotional Design System Components
export { KPICard } from "./kpi-card";
export { StatusBadge } from "./status-badge";
export {
  LoadingSpinner,
  LoadingSkeleton,
  LoadingOverlay,
  CardSkeleton,
  TableSkeleton,
  ButtonLoading,
} from "./loading-states";
export { EmotionalInput } from "./emotional-input";
export { EmotionalDataTable } from "./emotional-data-table";
export { EmotionalModal } from "./emotional-modal";

// Dialog and Modal Components
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./dialog";
export { Modal, ModalForm } from "./modal";

// Form Components
export {
  FormField,
  FormSelect,
  FormTextarea,
  FormCheckbox,
  FormCheckboxGroup,
} from "./form";

// Data Display Components
export { DataTable } from "./data-table";
export { StatCard } from "./stat-card";

// Feedback Components
export { Alert } from "./alert";

// Action Components
export {
  ActionButton,
  ModalActionButton,
  ConfirmActionButton,
} from "./action-button";

// Layout Components
export { PageHeader } from "../layout/page-header";
export { Breadcrumb } from "../navigation/breadcrumb";

// Landing Page Components
export * from "../landing";

// Re-export types for convenience
export type { Column, DataTableProps } from "./data-table";
export type { ModalProps, ModalFormProps } from "./modal";
export type {
  FormFieldProps,
  FormSelectProps,
  FormTextareaProps,
  FormCheckboxProps,
  FormCheckboxGroupProps,
} from "./form";
export type { AlertProps } from "./alert";
export type {
  ActionButtonProps,
  ModalActionButtonProps,
  ConfirmActionButtonProps,
} from "./action-button";
export type { StatCardProps } from "./stat-card";
export type { BreadcrumbItem, BreadcrumbProps } from "../navigation/breadcrumb";
export type {
  BreadcrumbItem as PageHeaderBreadcrumbItem,
  PageHeaderProps,
} from "../layout/page-header";
