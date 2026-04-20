function Card({
  children,
  className = '',
  padding = 'default',
  hover = false,
  onClick,
}) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
        ${paddingStyles[padding]}
        ${hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-white truncate ${className}`}>
      {children}
    </h3>
  )
}

function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 truncate ${className}`}>
      {children}
    </p>
  )
}

function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export default Card