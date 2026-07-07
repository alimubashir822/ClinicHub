import React from 'react';

// ==========================================
// Button Component
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-900/20 active:scale-[0.98]',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 active:scale-[0.98]',
      outline: 'bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 active:scale-[0.98]',
      danger: 'bg-rose-600 hover:bg-rose-500 text-white active:scale-[0.98]',
      ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white',
      glass: 'bg-white/10 hover:bg-white/15 backdrop-blur-md text-white border border-white/10 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ==========================================
// Card Components
// ==========================================
export const Card = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-lg ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-5 border-b border-slate-800/80 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-semibold text-slate-100 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-xs text-slate-400 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

// ==========================================
// Badge Component
// ==========================================
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'info' | 'error' | 'secondary' | 'neutral';
}

export const Badge = ({ className = '', variant = 'neutral', children, ...props }: BadgeProps) => {
  const baseStyle = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold';
  
  const variants = {
    success: 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50',
    warning: 'bg-amber-950/50 text-amber-400 border border-amber-800/50',
    info: 'bg-indigo-950/50 text-indigo-400 border border-indigo-800/50',
    error: 'bg-rose-950/50 text-rose-400 border border-rose-800/50',
    secondary: 'bg-slate-800/80 text-slate-300 border border-slate-700/80',
    neutral: 'bg-slate-700/30 text-slate-400 border border-slate-600/30',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

// ==========================================
// Input Components
// ==========================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full mb-4">
        {label && <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>}
        <input
          ref={ref}
          type={type}
          className={`w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/35 transition duration-150 ${error ? 'border-rose-500 focus:ring-rose-500/30' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, ...props }, ref) => {
    return (
      <div className="w-full mb-4">
        {label && <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/35 transition duration-150 appearance-none ${error ? 'border-rose-500 focus:ring-rose-500/30' : ''} ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-950">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, rows = 3, ...props }, ref) => {
    return (
      <div className="w-full mb-4">
        {label && <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>}
        <textarea
          ref={ref}
          rows={rows}
          className={`w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/35 transition duration-150 ${error ? 'border-rose-500 focus:ring-rose-500/30' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ==========================================
// Modal / Dialog Component
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Container */}
      <div className={`relative w-full ${sizeClasses[size]} bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
