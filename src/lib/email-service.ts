export interface EmailTemplateProps {
    tenantName: string;
    primaryColor: string;
    logoUrl?: string;
    studentName: string;
    schoolAddress?: string;
    schoolPhone?: string;
}

export function generateWelcomeEmailHtml({
    tenantName,
    primaryColor,
    logoUrl,
    studentName,
    schoolAddress = 'Endereço da Escola, 123',
    schoolPhone = '(55) 99999-9999'
}: EmailTemplateProps) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; margin-top: 40px; border: 1px solid #e5e7eb; }
        .header { background-color: ${primaryColor}; padding: 40px 20px; text-align: center; }
        .logo { max-width: 150px; height: auto; margin-bottom: 20px; }
        .content { padding: 40px; color: #1f2937; line-height: 1.6; }
        .footer { padding: 20px; background-color: #f3f4f6; text-align: center; font-size: 12px; color: #6b7280; }
        .button { display: inline-block; padding: 14px 28px; background-color: ${primaryColor}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 24px; }
        h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            ${logoUrl ? `<img src="${logoUrl}" class="logo" alt="${tenantName}">` : ''}
            <h1>Bem-vinda à ${tenantName}!</h1>
        </div>
        <div class="content">
            <p>Olá, <strong>${studentName}</strong>!</p>
            <p>É uma alegria imensa ter você conosco. Sua jornada na dança começa aqui e nossa missão é transformar cada passo seu em uma conquista inesquecível.</p>
            <p>Preparamos tudo com muito carinho para que você tenha a melhor experiência possível em nossa escola.</p>
            
            <a href="#" class="button">Acessar Meu Painel</a>
            
            <p style="margin-top: 32px; font-size: 14px;"><strong>Próximos passos:</strong><br>
            • Complete seu perfil no nosso aplicativo<br>
            • Confira sua grade de aulas<br>
            • Conheça seus professores</p>
        </div>
        <div class="footer">
            <p><strong>${tenantName}</strong><br>
            ${schoolAddress}<br>
            ${schoolPhone}</p>
            <p style="margin-top: 10px; opacity: 0.6;">Você recebeu este e-mail porque se matriculou na escola ${tenantName}.</p>
        </div>
    </div>
</body>
</html>
    `;
}

export async function sendBrandedEmail(to: string, subject: string, html: string) {
    // Simulação de envio de e-mail (Resend, SendGrid, etc)
    console.log(`[Email Service] Enviando e-mail para ${to} com o assunto: ${subject}`);
    return { success: true, messageId: Math.random().toString(36).substring(7) };
}
