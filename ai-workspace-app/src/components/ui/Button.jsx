import { Slot } from '@radix-ui/react-slot'
import { motion } from 'framer-motion'
import React from 'react'
import './Button.css'

/**
 * Radix UI Button with Framer Motion integration and theme support
 * Supports multiple variants and sizes with Sky (light) / Indigo (dark) theming
 */
const Button = React.forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      asChild = false,
      animated = true,
      disabled = false,
      className = '',
      children,
      onClick,
      type = 'button',
      title,
      style,
      ...props
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'button'
    const MotionComponent = motion(Component)

    // Animation variants
    const animationVariants = {
      initial: { scale: 1 },
      whileHover: animated && !disabled ? { scale: 1.08 } : { scale: 1 },
      whileTap: animated && !disabled ? { scale: 0.95 } : { scale: 1 },
      transition: { duration: 0.2 },
    }

    // Special animation for icon-only buttons
    const iconAnimationVariants = {
      initial: { scale: 1 },
      whileHover: animated && !disabled ? { scale: 1.1 } : { scale: 1 },
      whileTap: animated && !disabled ? { scale: 0.95 } : { scale: 1 },
      transition: { duration: 0.2 },
    }

    const useIconAnimation = variant === 'icon' || variant === 'ghost'
    const variants = useIconAnimation ? iconAnimationVariants : animationVariants

    const buttonClasses = [
      'radix-button',
      `button-variant-${variant}`,
      `button-size-${size}`,
      disabled ? 'button-disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <MotionComponent
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={buttonClasses}
        title={title}
        style={style}
        {...variants}
        {...props}
      >
        {children}
      </MotionComponent>
    )
  }
)

Button.displayName = 'Button'

export default Button
