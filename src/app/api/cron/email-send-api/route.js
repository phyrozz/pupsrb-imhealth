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
    const { data: users, error: dbError } = await supabase
      .from("assessment_reminders")
      .select(`
        assessment_reminders.*,
        personal_details.email
      `)
      .lte("assessment_reminders.last_assessment_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)) // Two weeks ago
      .eq("assessment_reminders.reminder_sent", false)
      .join("personal_details", { 
        on: "assessment_reminders.user_id:personal_details.user_id" 
    });

    if (dbError) {
      throw dbError
    }

    for (const user of users) {
      // Send reminder email
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Assessment Reminder - PUPSRB-iMHealth',
        html: `<div>
                <h3>PUPSRB-iMHealth</h3>
                <p>Thank you for participating in our on-campus research study. Please answer this assessment form again as your responses will help in our study. Thank you!</p>
                <a href="https://pupsrb-imhealth.vercel.app/assessment/login">Answer assessment form</a>
              </div>`
      })

      // Update reminder_sent flag in the database
      await supabase
        .from("assessment_reminders")
        .update({ reminder_sent: true })
        .eq("user_id", user.user_id)
    }

    return NextResponse.json({ message: "Reminder emails sent successfully" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error: cannot invoke CRON job." }, { status: 500 })
  }
}