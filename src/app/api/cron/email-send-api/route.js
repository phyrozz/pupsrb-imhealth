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
      .eq("id", "1f759afc-5416-4b56-af51-234dd9d79bca")

    if (dbError) {
      throw dbError
    }

    const emailsToSend = users.map((user) => ({
      from: "team@pupsrc-otms.online",
      to: [user.profiles.personal_details[0].email],
      subject: "Assessment Reminder - PUP-iMHealth",
      html: `<div>
                <h3>PUP-iMHealth</h3>
                <p><b>Hi, ${user.profiles.personal_details[0].first_name}!</b></p>
                <p>Thank you for participating in our on-campus research study. Please answer this assessment form again as your responses will help in our study. Thank you!</p>
                <a href="https://pupsrb-imhealth.vercel.app/assessment/login">Answer assessment form</a>
              </div>`,
    }))

    // Send batch of reminder emails
    await resend.batch.send(emailsToSend)

    // Update reminder_sent flag in the database for each user
    for (const user of users) {
      await supabase.from("assessment_reminders").update({ reminder_sent: true }).eq("id", user.id)
    }

    return NextResponse.json({ message: "Reminder emails sent successfully" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error: cannot invoke CRON job." }, { status: 500 })
  }
}