import { NextResponse } from "next/server"
import { headers } from "next/headers"
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const headersList = headers()
    const authHeader = headersList.get('authorization')

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({message: "GET"}, {status: 401})
    }

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'joshuamalabanan70@gmail.com',
      subject: 'Hello, world!',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    })

    return NextResponse.json({message: "GET"}, {status: 200})
  } catch (error) {
    console.error(error)
    return NextResponse.json({message: "Error: cannot invocate CRON job."})
  }
  
}