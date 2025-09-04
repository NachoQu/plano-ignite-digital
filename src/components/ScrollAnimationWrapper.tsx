import { useRef, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  className?: string;
  animationType?: 'fade-in' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  threshold?: number;
}

export const ScrollAnimationWrapper = ({ 
  children, 
  className = '', 
  animationType = 'fade-in',
  delay = 0,
  threshold = 0.1
}: ScrollAnimationWrapperProps) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`animate-scroll-${animationType} ${inView ? 'in-view' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};