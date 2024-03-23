import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const resend = new Resend(process.env.RESEND_API_KEY)
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const headersList = headers()
    const authHeader = headersList.get('authorization')

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      throw new Error("Invalid authorization")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    const { data: users, error: dbError } = await supabase
      .from("assessment_reminders")
      .select(`id, created_at, last_assessment_at, reminder_sent, profiles (personal_details (email, first_name))`)
      .lte("last_assessment_at", twoWeeksAgo)
      .eq("reminder_sent", false)

    if (dbError) {
      throw dbError
    }

    // Update reminder_sent flags on all users whose last assessment was two weeks ago
    await supabase
      .from("assessment_reminders")
      .update({ reminder_sent: true })
      .lte("last_assessment_at", twoWeeksAgo)
      .eq("reminder_sent", false)

    const emailsToSend = []

    for (const user of users) {
      // Check if user has personal details and email
      if (user.profiles && user.profiles.personal_details && user.profiles.personal_details.length > 0) {
        const email = user.profiles.personal_details[0].email
        const firstName = user.profiles.personal_details[0].first_name || 'there' // Default to 'there' if first name is not available
        emailsToSend.push({
          from: "team@pupsrc-otms.online",
          to: [email],
          subject: "Assessment Reminder - PUP-iMHealth",
          html: `<div>
                    <h2>PUP-iMHealth</h2>
                    <p><b>Hi, ${firstName}!</b></p>
                    <p>Thank you for participating in our on-campus research study. Please answer this assessment form again as your responses will help in our study. Thank you!</p>
                    <a href="https://pupsrb-imhealth.vercel.app/assessment/login">Answer assessment form</a>
                  </div>`,
        })
      }
    }

    await resend.batch.send(emailsToSend)

    return NextResponse.json({ message: "Reminder emails sent successfully" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error: cannot invoke CRON job." }, { status: 500 })
  }
}