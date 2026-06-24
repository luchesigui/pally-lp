import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, destination } = await request.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Nome e e-mail são obrigatórios.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'gui.olhenrique@gmail.com',
      subject: `🌍 Nova inscrição no Pally — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fafafa; border-radius: 12px;">
          <h2 style="color: #1a1a2e; margin-bottom: 8px;">Nova inscrição na lista de espera do Pally!</h2>
          <p style="color: #4b5563; margin-bottom: 24px;">Alguém acabou de se inscrever através da landing page.</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-weight: 600; width: 140px;">Nome</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1a1a2e;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-weight: 600;">E-mail</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1a1a2e;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #4b5563; font-weight: 600;">Próximo destino</td>
              <td style="padding: 10px 0; color: #1a1a2e;">${destination || '—'}</td>
            </tr>
          </table>
          <p style="margin-top: 32px; font-size: 0.8rem; color: #8e9aa8;">Enviado automaticamente pelo Pallas Landing · ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[subscribe] Resend error:', err);
    return new Response(JSON.stringify({ error: 'Falha ao enviar e-mail.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
