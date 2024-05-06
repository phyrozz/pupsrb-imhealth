// import { createClient } from "@supabase/supabase-js"
// import { NextResponse } from 'next/server'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// export async function GET() {
//   try {
//     const supabase = createClient(supabaseUrl, supabaseKey)
//     const threeWeeksAgo = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
//     const { data: users, error: dbError } = await supabase
//       .from("assessment_reminders")
//       .select(`id, created_at, last_assessment_at, reminder_sent, profiles (personal_details (user_id, email, first_name))`)
//       .lte("last_assessment_at", threeWeeksAgo)
//       .eq("reminder_sent", true)
//       .eq("unanswered_reminder_sent", false)

//     // reminder_sent indicates whether the student has already answered the most recent assessment or not

//     if (dbError) {
//       throw dbError
//     }

//     // Extracting only the user_ids from the users array
//     const userIds = users.flatMap(user => user.profiles)

//     return NextResponse.json({ message: 'Users retrieved successfully.', data: userIds }, { status: 200 })
//   } catch (error) {
//     return NextResponse.json({ message: 'Failed to retrieve users.', error: error }, { status: 400 }) 
//   }
// }

