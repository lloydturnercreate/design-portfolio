/**
 * Email capture.
 *
 * The list is the thing that survives a launch spike — traffic from a Phasmatic
 * launch is worth nothing a week later unless some of it is reachable again.
 *
 * Provider-agnostic on purpose: point BUTTONDOWN_API_KEY (or swap the fetch for
 * another provider) and this starts persisting. Until a key is set it returns
 * 503 rather than pretending to have stored the address — a form that silently
 * drops signups is worse than no form.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(request: Request) {
  let email: unknown

  try {
    ({ email } = await request.json())
  } catch {
    return Response.json({ error: 'Malformed request.' }, { status: 400 })
  }

  if (typeof email !== 'string' || !EMAIL.test(email.trim())) {
    return Response.json({ error: 'That does not look like an email address.' }, { status: 400 })
  }

  const key = process.env.BUTTONDOWN_API_KEY
  if (!key) {
    console.warn('[subscribe] No BUTTONDOWN_API_KEY set — signup discarded:', email)
    return Response.json({ error: 'Signups are not open yet.' }, { status: 503 })
  }

  const res = await fetch('https://api.buttondown.email/v1/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Token ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email_address: email.trim() }),
  })

  // Already subscribed is a success from the visitor's point of view.
  if (!res.ok && res.status !== 409) {
    console.error('[subscribe] Provider rejected signup:', res.status, await res.text())
    return Response.json({ error: 'Something went wrong. Try again?' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
