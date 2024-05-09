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
    const { data: increaseTrend, error: increaseTrendError } = await supabase.rpc("count_scenario_increase")

    if (increaseTrendError) {
      throw increaseTrendError
    }

    const { data: decreaseTrend, error: decreaseTrendError } = await supabase.rpc("count_scenario_decrease")

    if (decreaseTrendError) {
      throw decreaseTrendError
    }

    const { error: insertIncreaseTrendError } = await supabase
      .from("mental_health_uptrend")
      .insert({
        count: increaseTrend[0].count
      })
    
    if (insertIncreaseTrendError) {
      throw insertIncreaseTrendError
    }

    const { error: insertDecreaseTrendError } = await supabase
      .from("mental_health_downtrend")
      .insert({
        count: decreaseTrend[0].count
      })

    if (insertDecreaseTrendError) {
      throw insertDecreaseTrendError
    }

    return NextResponse.json({ message: "CRON job invoked successfully." }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Error: cannot invoke CRON job.", error: error }, { status: 500 })
  }
}