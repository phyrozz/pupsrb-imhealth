// import { NextResponse } from "next/server"
// import { headers } from "next/headers"
// import { createClient } from "@supabase/supabase-js"
// import { Resend } from "resend"

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// const resend = new Resend(process.env.RESEND_API_KEY)
// export const dynamic = 'force-dynamic'

// export async function GET() {
//   try {
//     const headersList = headers()
//     const authHeader = headersList.get('authorization')

//     if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//       throw new Error("Invalid authorization")
//     }

//     const supabase = createClient(supabaseUrl, supabaseKey)
//     const threeWeeksAgo = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
//     const { data: users, error: dbError } = await supabase
//       .from("assessment_reminders")
//       .select(`id, created_at, last_assessment_at, reminder_sent, profiles (personal_details (user_id, email, first_name))`)
//       .lte("last_assessment_at", threeWeeksAgo)
//       .eq("reminder_sent", true)
//       .eq("unanswered_reminder_sent", false)

//     if (dbError) {
//       throw dbError
//     }

//     const emailsToSend = []

//     for (const user of users) {
//       if (emailsToSend.length <= 20) {
//         // Check if user has personal details and email
//         if (user.profiles && user.profiles.personal_details && user.profiles.personal_details.length > 0) {
//           const email = user.profiles.personal_details[0].email
//           const firstName = user.profiles.personal_details[0].first_name || 'there' // Default to 'there' if first name is not available
//           emailsToSend.push({
//             userId: user.profiles.personal_details[0].user_id,
//             email: {
//               from: "team@pupsrc-otms.online",
//               to: [email],
//               subject: "Unanswered Assessment Reminder - PUP-iMHealth",
//               html: `<div>
//                       <h2>PUP-iMHealth</h2>
//                       <p><b>Hi, ${firstName}!</b></p>
//                       <p>Thank you for participating in our on-campus research study. It seems that you haven't completed the latest assessment yet. Your input is valuable to us and helps us in our research efforts.</p>
//                       <p>Please take a few moments to answer the assessment. Your contribution is greatly appreciated! 😊</p>
//                       <a href="https://pupsrb-imhealth.vercel.app/assessment/login">Answer assessment form</a>
//                     </div>
//                     `,
//             }
//           })
//         }
//       }
//     }

//     // Update unanswered_reminder_sent flags on all users who have not yet answered their latest assessment one week after the reminder email was sent and part of the email sending batch
//     await supabase
//       .from("assessment_reminders")
//       .update({ unanswered_reminder_sent: true })
//       .lte("last_assessment_at", threeWeeksAgo)
//       .eq("reminder_sent", true)
//       .eq("unanswered_reminder_sent", false)
//       .in("user_id", emailsToSend.flatMap(email => email.userId))

//     await resend.batch.send(emailsToSend.flatMap(email => email.email))

//     return NextResponse.json({ message: "CRON job invoked successfully." }, { status: 200 })
//   } catch (error) {
//     return NextResponse.json({ message: "Error: cannot invoke CRON job.", error: error }, { status: 500 })
//   }
// }