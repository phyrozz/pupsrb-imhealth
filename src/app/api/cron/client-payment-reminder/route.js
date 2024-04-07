import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const headersList = headers()
    const authHeader = headersList.get('authorization')

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      throw new Error("Invalid authorization")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase.from("pay_up").select("opacity").limit(1).single()

    if (error) { throw error }

    await supabase.from("pay_up").update({ opacity: data.opacity + 5 })

    return NextResponse.json({ message: "Opacity updated successfully" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error: cannot invoke CRON job." }, { status: 500 })
  }
}