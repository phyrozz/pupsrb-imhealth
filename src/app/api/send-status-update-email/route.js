import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  // if (req.method !== 'POST') {
  //   return res.status(405).end()
  // }

  // if (!req.user) {
  //   return res.status(401).end()
  // }

  let res = await request.json()

  const { email, firstName, assessmentTimestamps } = res

  const statusChangesList = `
    <ul>
      ${assessmentTimestamps.map(assessment => `
        <li>
          <p>Assessment answered on: ${new Date(assessment).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</p>
        </li>
      `).join('')}
    </ul>
  `

  await resend.emails.send({
    from: "team@pupsrc-otms.online",
    to: [email],
    subject: "Assessment Status Update - PUP-iMHealth",
    html: `
    <div>
      <h2>PUP-iMHealth</h2>
      <p><b>Hi, ${firstName || 'there'}!</b></p>
      <p>Your assessment${assessmentTimestamps.length > 1 ? "s" : ""} ${assessmentTimestamps.length > 1 ? "have" : "has"} been reviewed by a Clinician/Guidance Counselor:</p>
      ${statusChangesList}
      <p>Please visit the Guidance Office on Room 210 at any time for counseling or further assessments. Thank you!</p>
    </div>
    `,
  })

  return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
}
