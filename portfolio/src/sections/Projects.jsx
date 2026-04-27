import { useState } from "react"




const useIsMobile = (query = "(max-width : 639px)") => {
  const[isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.matchMedia(query).matches
  )
}

export default function projects(){
  return(

    <section id="projects" className="relative text-white">

    
    </section>


  )
}