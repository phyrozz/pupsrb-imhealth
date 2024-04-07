"use client"
import React from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function WhiteScreenOverlay() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)

  const [opacity, setOpacity] = React.useState(0)

  React.useEffect(() => {
    const getOpacity = async () => {
      try {
        const { data, error } = await supabase.from('pay_up').select("opacity").limit(1).single()

        if (error) { throw error }

        let opacity = data.opacity * 0.01
        setOpacity(opacity)
      } catch (error) {}
    }

    getOpacity()
  }, [supabase])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  )
}
