import { NextResponse } from "next/server"
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { Resend } from "resend"

const resend = new Resend('re_9TqgCnkH_5xKweh4GJw5Wt5uc5MLatUqR')
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'joshuamalabanan70@gmail.com',
      subject: 'Hello, world!',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    })

    return NextResponse.ok()
  } catch (error) {
    console.error(error)
    return NextResponse.error("Error invoking CRON job.")
  }
  
}