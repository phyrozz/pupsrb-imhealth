// import { createClient } from "@supabase/supabase-js"
// import { NextResponse } from 'next/server'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// export async function GET() {
//   try {
//     const supabase = createClient(supabaseUrl, supabaseKey)
//     const { data, error } = await supabase.rpc("count_scenario_increase")

//     if (error) {
//       throw error
//     }

//     return NextResponse.json({ message: 'Count retrieved successfully.', data: data }, { status: 200 })
//   } catch (error) {
//     return NextResponse.json({ message: 'Failed to retrieve count.', error: error }, { status: 400 }) 
//   }
// }

