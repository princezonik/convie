import type * as React from 'react';

export type Currency = 'NGN' | 'GHS' | 'KES' | 'ZAR' | 'GBP' | 'EUR' | 'USD';
export type StatusKey = 'paid' | 'delivered' | 'settled' | 'approved' | 'available' | 'live' | 'paid-out' | 'verified' | 'matched' | 'pending' | 'awaiting-review' | 'on-hold' | 'confirming' | 'processing' | 'awaiting-shipment' | 'shipped' | 'in-transit' | 'scheduled' | 'open' | 'failed' | 'declined' | 'disputed' | 'rejected' | 'break' | 'refunded' | 'draft' | 'cancelled' | 'new-vendor';

export interface IconProps { name: string; size?: 'sm'; label?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'; size?: 'sm' | 'lg'; icon?: string; iconRight?: string; loading?: boolean; block?: boolean }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface StatusPillProps { status: StatusKey; noIcon?: boolean; children?: React.ReactNode }
export declare function StatusPill(props: StatusPillProps): React.ReactElement;
/** Integer minor units (kobo, pesewa, cents). Never floats. */
export interface MoneyProps { minor: number; currency: Currency; whole?: boolean; locale?: string; className?: string }
export declare function Money(props: MoneyProps): React.ReactElement;
export interface PriceTagProps { minor: number; currency: Currency; baseMinor?: number; baseCurrency?: Currency; rate?: string; size?: 'lg' }
export declare function PriceTag(props: PriceTagProps): React.ReactElement;
export interface FieldProps { label: string; hint?: string; error?: string; placeholder?: string; defaultValue?: string; type?: string; prefix?: string; multiline?: boolean; size?: 'lg'; id?: string; className?: string; inputProps?: React.InputHTMLAttributes<HTMLInputElement> }
export declare function Field(props: FieldProps): React.ReactElement;
export interface SelectProps { label?: string; options: Array<string | { value: string; label: string }>; defaultValue?: string; hint?: string; onChange?: React.ChangeEventHandler<HTMLSelectElement>; className?: string }
export declare function Select(props: SelectProps): React.ReactElement;
export interface OtpInputProps { length?: number; value?: string; label?: string }
export declare function OtpInput(props: OtpInputProps): React.ReactElement;
export interface PaymentMethod { id: string; title: string; meta?: string; icon: string }
export interface MethodPickerProps { country?: 'NG' | 'GH' | 'KE' | 'GB' | 'EU' | 'US'; methods?: PaymentMethod[]; defaultValue?: string; onChange?: (id: string) => void }
export declare function MethodPicker(props: MethodPickerProps): React.ReactElement;
export interface AlertProps { tone?: 'info' | 'success' | 'warning' | 'danger'; title?: string; children?: React.ReactNode }
export declare function Alert(props: AlertProps): React.ReactElement;
export interface FxLockProps { rate?: string; seconds?: number; onRequote?: () => void }
export declare function FxLock(props: FxLockProps): React.ReactElement;
export interface StatTileProps { label: string; value: React.ReactNode; meta?: string; delta?: string; icon?: string; tone?: 'pending' | 'available' }
export declare function StatTile(props: StatTileProps): React.ReactElement;
export interface Column<R> { key: string; label: string; align?: 'right'; mono?: boolean; render?: (row: R) => React.ReactNode }
export interface DataTableProps<R = any> { columns: Column<R>[]; rows: Array<R & { id?: string; _selected?: boolean; _flag?: boolean }>; footer?: React.ReactNode }
export declare function DataTable<R>(props: DataTableProps<R>): React.ReactElement;
export interface TabsProps { items: Array<{ value: string; label: string; count?: number }>; defaultValue?: string; onChange?: (v: string) => void }
export declare function Tabs(props: TabsProps): React.ReactElement;
export interface StepperProps { steps: string[]; current?: number }
export declare function Stepper(props: StepperProps): React.ReactElement;
export interface OrderTimelineProps { events: Array<{ title: string; meta?: string; state?: 'done' | 'current' | 'todo'; icon?: string }> }
export declare function OrderTimeline(props: OrderTimelineProps): React.ReactElement;
export interface ProductCardProps { name: string; vendor: string; origin?: string; minor: number; currency: Currency; baseMinor?: number; baseCurrency?: Currency; rating?: string; reviews?: number; badge?: StatusKey; image?: string; art?: 'a' | 'b' | 'c' | 'd'; href?: string }
export declare function ProductCard(props: ProductCardProps): React.ReactElement;
export interface VendorCartGroupProps { vendor: { name: string; origin: string; eta?: string; currency: Currency; isNew?: boolean }; items: Array<{ name: string; variant?: string; qty: number; minor: number; baseMinor?: number; lowStock?: string; art?: 'a' | 'b' | 'c' | 'd' }>; currency: Currency; shippingMinor: number; shippingLabel?: string }
export declare function VendorCartGroup(props: VendorCartGroupProps): React.ReactElement;
export interface OrderSummaryProps { currency: Currency; lines: Array<{ label: string; minor: number; muted?: boolean }>; totalMinor: number; note?: string }
export declare function OrderSummary(props: OrderSummaryProps): React.ReactElement;
export interface TopNavProps { country?: string; currency?: Currency; cartCount?: number; user?: string; query?: string }
export declare function TopNav(props: TopNavProps): React.ReactElement;
export interface SideNavProps { role: string; items: Array<{ value?: string; label?: string; icon?: string; count?: number; section?: string }>; current?: string; account?: { initials: string; name: string; meta?: string } }
export declare function SideNav(props: SideNavProps): React.ReactElement;
export interface EmptyStateProps { icon?: string; title: string; children?: React.ReactNode; action?: React.ReactNode }
export declare function EmptyState(props: EmptyStateProps): React.ReactElement;

declare global { interface Window { Convie: {
  Icon: typeof Icon; Button: typeof Button; StatusPill: typeof StatusPill; Money: typeof Money; PriceTag: typeof PriceTag; Field: typeof Field; Select: typeof Select; OtpInput: typeof OtpInput; MethodPicker: typeof MethodPicker; Alert: typeof Alert; FxLock: typeof FxLock; StatTile: typeof StatTile; DataTable: typeof DataTable; Tabs: typeof Tabs; Stepper: typeof Stepper; OrderTimeline: typeof OrderTimeline; ProductCard: typeof ProductCard; VendorCartGroup: typeof VendorCartGroup; OrderSummary: typeof OrderSummary; TopNav: typeof TopNav; SideNav: typeof SideNav; EmptyState: typeof EmptyState;
  formatMoney(minor: number, currency: Currency, opts?: { whole?: boolean; locale?: string }): string;
  hydrateIcons(root?: ParentNode): void;
  iconNames: string[];
} } }
