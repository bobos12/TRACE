import type * as React from 'react';
type Div = React.HTMLAttributes<HTMLDivElement>;
export interface LogoProps { variant?: 'wordmark' | 'arabic' | 'bilingual' | 'symbol'; size?: number; tone?: 'color' | 'mono' | 'accent'; className?: string; style?: React.CSSProperties }
export declare function Logo(p: LogoProps): React.ReactElement;
export interface NuqtaProps { size?: number; tone?: 'mark' | 'accent' | 'ink' | 'muted'; stamp?: boolean; className?: string; style?: React.CSSProperties }
export declare function Nuqta(p: NuqtaProps): React.ReactElement;
export interface ConstellationProps { seed?: string; size?: number; quiet?: boolean; className?: string; style?: React.CSSProperties }
export declare function Constellation(p: ConstellationProps): React.ReactElement;
export type IconName = 'arrow-right' | 'arrow-up-right' | 'check' | 'close' | 'plus' | 'minus' | 'search' | 'menu' | 'chevron-down' | 'chevron-right' | 'info' | 'alert' | 'error' | 'success' | 'user' | 'sliders' | 'dashboard' | 'inbox' | 'file' | 'chart' | 'bell' | 'calendar' | 'globe' | 'code' | 'layers' | 'nuqta';
export interface IconProps { name: IconName; size?: number; label?: string; flip?: boolean; className?: string; style?: React.CSSProperties }
export declare function Icon(p: IconProps): React.ReactElement;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'ink' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; icon?: IconName; iconEnd?: IconName; cut?: boolean; href?: string }
export declare function Button(p: ButtonProps): React.ReactElement;
export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: React.ReactNode; hint?: React.ReactNode; error?: React.ReactNode; optional?: boolean | string; prefix?: string; multiline?: boolean }
export declare function TextField(p: TextFieldProps): React.ReactElement;
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: React.ReactNode; hint?: React.ReactNode; error?: React.ReactNode; options: Array<string | { value: string; label: string }> }
export declare function Select(p: SelectProps): React.ReactElement;
export interface ChoiceProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: React.ReactNode }
export declare function Checkbox(p: ChoiceProps): React.ReactElement;
export declare function Radio(p: ChoiceProps): React.ReactElement;
export declare function Switch(p: ChoiceProps): React.ReactElement;
export interface TabsProps { items: Array<{ label: React.ReactNode; value?: string; count?: number }>; value?: string; onChange?: (v: string) => void; variant?: 'line' | 'segmented'; className?: string }
export declare function Tabs(p: TabsProps): React.ReactElement;
export interface NavBarProps { links?: Array<string | { label: string; href?: string; current?: boolean }>; lang?: string; cta?: string; arabic?: boolean; className?: string }
export declare function NavBar(p: NavBarProps): React.ReactElement;
export interface SidebarProps { client?: string; product?: string; groups?: Array<{ title?: string; items: Array<{ label: string; icon?: IconName; count?: number; current?: boolean }> }>; footer?: React.ReactNode; className?: string }
export declare function Sidebar(p: SidebarProps): React.ReactElement;
export interface CardProps { title?: React.ReactNode; eyebrow?: React.ReactNode; action?: React.ReactNode; footer?: React.ReactNode; cut?: boolean; inverse?: boolean; as?: string; children?: React.ReactNode; className?: string; style?: React.CSSProperties }
export declare function Card(p: CardProps): React.ReactElement;
export interface ModalProps { title: string; open?: boolean; onClose?: () => void; actions?: React.ReactNode; inline?: boolean; children?: React.ReactNode }
export declare function Modal(p: ModalProps): React.ReactElement | null;
export interface TableColumn<R> { key: string; label: React.ReactNode; numeric?: boolean; muted?: boolean; width?: number | string; render?: (row: R) => React.ReactNode }
export interface TableProps<R> { columns: TableColumn<R>[]; rows: Array<R & { id?: string; selected?: boolean }>; className?: string }
export declare function Table<R = Record<string, unknown>>(p: TableProps<R>): React.ReactElement;
export interface BadgeProps { tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'outline'; dot?: boolean; children?: React.ReactNode; className?: string }
export declare function Badge(p: BadgeProps): React.ReactElement;
export interface TooltipProps { label: React.ReactNode; kbd?: string; open?: boolean; children: React.ReactNode }
export declare function Tooltip(p: TooltipProps): React.ReactElement;
export interface BannerProps { tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger'; title?: React.ReactNode; icon?: IconName; action?: React.ReactNode; onClose?: () => void; children?: React.ReactNode; className?: string }
export declare function Banner(p: BannerProps): React.ReactElement;
export interface ToastProps { action?: React.ReactNode; onClose?: () => void; trace?: boolean; children?: React.ReactNode; className?: string }
export declare function Toast(p: ToastProps): React.ReactElement;
export interface EmptyStateProps { title: React.ReactNode; action?: React.ReactNode; seed?: string; children?: React.ReactNode; className?: string }
export declare function EmptyState(p: EmptyStateProps): React.ReactElement;
export interface LoaderProps { size?: number; label?: string; className?: string }
export declare function Loader(p: LoaderProps): React.ReactElement;
export interface StatProps { label: React.ReactNode; value: React.ReactNode; delta?: string; period?: string; invert?: boolean; hint?: React.ReactNode; className?: string }
export declare function Stat(p: StatProps): React.ReactElement;
/** Returns the cells a seed fills in the 3×3 lattice (0–8, row-major) and which one is the vermilion mark. */
export declare function constellation(seed?: string): { on: number[]; mark: number };
declare global { interface Window { Athr: { Logo: typeof Logo; Nuqta: typeof Nuqta; Constellation: typeof Constellation; Icon: typeof Icon; Button: typeof Button; TextField: typeof TextField; Select: typeof Select; Checkbox: typeof Checkbox; Radio: typeof Radio; Switch: typeof Switch; Tabs: typeof Tabs; NavBar: typeof NavBar; Sidebar: typeof Sidebar; Card: typeof Card; Modal: typeof Modal; Table: typeof Table; Badge: typeof Badge; Tooltip: typeof Tooltip; Banner: typeof Banner; Toast: typeof Toast; EmptyState: typeof EmptyState; Loader: typeof Loader; Stat: typeof Stat; constellation: typeof constellation } } }
