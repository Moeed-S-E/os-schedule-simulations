const styles = {
  default: 'text-app',
  active: 'text-accent shadow-inset',
  primary: 'text-accent',
  danger: 'px-3 py-1.5 text-warning',
}

function ActionButton({ variant = 'default', className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`rounded-[14px] bg-surface px-4.5 py-2.5 font-bold shadow-raised transition-shadow hover:shadow-inset active:shadow-inset focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-55 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default ActionButton
