
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = React.useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    hasTouch: false,
    isStandalone: false
  })

  React.useEffect(() => {
    const checkCapabilities = () => {
      const width = window.innerWidth
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const isDesktop = width >= 1024
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches

      setCapabilities({
        isMobile,
        isTablet,
        isDesktop,
        hasTouch,
        isStandalone
      })
    }

    checkCapabilities()
    window.addEventListener('resize', checkCapabilities)
    return () => window.removeEventListener('resize', checkCapabilities)
  }, [])

  return capabilities
}
