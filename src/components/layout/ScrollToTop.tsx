import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // If there's an anchor hash like #features, scroll smoothly to it
      const targetId = hash.replace("#", "")
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
        return
      }
    }
    // Otherwise, scroll instantly back to the top of the page
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname, hash])

  return null
}
