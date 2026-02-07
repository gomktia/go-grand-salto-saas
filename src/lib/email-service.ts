export interface EmailTemplateProps {
    tenantName: string;
    primaryColor: string;
    logoUrl?: string;
    studentName: string;
    schoolAddress?: string;
    schoolPhone?: string;
}

// ============================================
// BASE TEMPLATE
// ============================================

function emailWrapper(params: {
    primaryColor: string;
    tenantName: string;
    logoUrl?: string;
    title: string;
    body: string;
}) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; color: #1f2937; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; margin-top: 40px; border: 1px solid #e5e7eb; }
        .header { background-color: ${params.primaryColor}; padding: 32px 20px; text-align: center; }
        .logo { max-width: 120px; height: auto; margin-bottom: 16px; }
        .content { padding: 32px 40px; line-height: 1.7; font-size: 15px; }
        .footer { padding: 20px; background-color: #f3f4f6; text-align: center; font-size: 12px; color: #6b7280; }
        .button { display: inline-block; padding: 14px 28px; background-color: ${params.primaryColor}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
        .alert-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; }
        .info-box { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; }
        .success-box { background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; }
        h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
        h2 { color: #111827; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
        p { margin: 0 0 12px 0; }
        .muted { color: #6b7280; font-size: 13px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            ${params.logoUrl ? `<img src="${params.logoUrl}" class="logo" alt="${params.tenantName}">` : ''}
            <h1>${params.title}</h1>
        </div>
        <div class="content">
            ${params.body}
        </div>
        <div class="footer">
            <p><strong>${params.tenantName}</strong></p>
            <p class="muted">Você recebeu este e-mail porque está vinculado à ${params.tenantName}.</p>
        </div>
    </div>
</body>
</html>`;
}

// ============================================
// 1. WELCOME EMAIL
// ============================================

export function generateWelcomeEmailHtml({
    tenantName,
    primaryColor,
    logoUrl,
    studentName,
    schoolAddress = 'Endereço da Escola, 123',
    schoolPhone = '(55) 99999-9999'
}: EmailTemplateProps) {
    return emailWrapper({
        primaryColor,
        tenantName,
        logoUrl,
        title: `Bem-vinda à ${tenantName}!`,
        body: `
            <p>Olá, <strong>${studentName}</strong>!</p>
            <p>É uma alegria imensa ter você conosco. Sua jornada na dança começa aqui e nossa missão é transformar cada passo seu em uma conquista inesquecível.</p>
            <p>Preparamos tudo com muito carinho para que você tenha a melhor experiência possível em nossa escola.</p>

            <a href="#" class="button">Acessar Meu Painel</a>

            <p style="margin-top: 24px; font-size: 14px;"><strong>Próximos passos:</strong><br>
            • Complete seu perfil no nosso aplicativo<br>
            • Confira sua grade de aulas<br>
            • Conheça seus professores</p>

            <p class="muted" style="margin-top: 16px;">${schoolAddress} · ${schoolPhone}</p>
        `,
    });
}

// ============================================
// 2. ABSENCE ALERT EMAIL (Responsável)
// ============================================

export function generateAbsenceAlertEmailHtml(params: {
    tenantName: string;
    primaryColor: string;
    logoUrl?: string;
    studentName: string;
    turmaName: string;
    faltasConsecutivas: number;
}) {
    return emailWrapper({
        primaryColor: params.primaryColor,
        tenantName: params.tenantName,
        logoUrl: params.logoUrl,
        title: 'Alerta de Faltas Consecutivas',
        body: `
            <p>Olá,</p>
            <div class="alert-box">
                <strong>${params.studentName}</strong> faltou <strong>${params.faltasConsecutivas} aulas consecutivas</strong> na turma <strong>${params.turmaName}</strong>.
            </div>
            <p>A frequência regular é essencial para o desenvolvimento na dança. Caso haja alguma situação especial, entre em contato conosco para que possamos ajudar.</p>
            <a href="#" class="button">Ver Frequência no Portal</a>
            <p class="muted" style="margin-top: 20px;">Esta é uma notificação automática do sistema de acompanhamento de presença.</p>
        `,
    });
}

// ============================================
// 3. ABSENCE ALERT EMAIL (Diretora)
// ============================================

export function generateAbsenceAlertDiretoraEmailHtml(params: {
    tenantName: string;
    primaryColor: string;
    logoUrl?: string;
    studentName: string;
    turmaName: string;
    faltasConsecutivas: number;
    responsavelNome?: string;
}) {
    return emailWrapper({
        primaryColor: params.primaryColor,
        tenantName: params.tenantName,
        logoUrl: params.logoUrl,
        title: 'Alerta: Aluno com Faltas Consecutivas',
        body: `
            <div class="alert-box">
                <h2 style="margin-top: 0;">${params.studentName}</h2>
                <p style="margin-bottom: 0;"><strong>Turma:</strong> ${params.turmaName}<br>
                <strong>Faltas consecutivas:</strong> ${params.faltasConsecutivas}<br>
                ${params.responsavelNome ? `<strong>Responsável:</strong> ${params.responsavelNome}` : ''}</p>
            </div>
            <p>Recomendamos entrar em contato com o responsável para entender a situação e evitar evasão.</p>
            <a href="#" class="button">Ver Painel de Alertas</a>
        `,
    });
}

// ============================================
// 4. PAYMENT REMINDER EMAIL
// ============================================

export function generatePaymentReminderEmailHtml(params: {
    tenantName: string;
    primaryColor: string;
    logoUrl?: string;
    studentName: string;
    valor: string;
    mesReferencia: string;
    dataVencimento: string;
}) {
    return emailWrapper({
        primaryColor: params.primaryColor,
        tenantName: params.tenantName,
        logoUrl: params.logoUrl,
        title: 'Lembrete de Mensalidade',
        body: `
            <p>Olá,</p>
            <div class="info-box">
                <p style="margin-bottom: 0;"><strong>Aluno:</strong> ${params.studentName}<br>
                <strong>Referência:</strong> ${params.mesReferencia}<br>
                <strong>Valor:</strong> ${params.valor}<br>
                <strong>Vencimento:</strong> ${params.dataVencimento}</p>
            </div>
            <p>Lembre-se de efetuar o pagamento até a data de vencimento para evitar juros e multas.</p>
            <a href="#" class="button">Pagar Agora</a>
            <p class="muted" style="margin-top: 20px;">Caso já tenha efetuado o pagamento, desconsidere este lembrete.</p>
        `,
    });
}

// ============================================
// 5. PAYMENT OVERDUE EMAIL
// ============================================

export function generatePaymentOverdueEmailHtml(params: {
    tenantName: string;
    primaryColor: string;
    logoUrl?: string;
    studentName: string;
    valor: string;
    mesReferencia: string;
    diasAtraso: number;
}) {
    return emailWrapper({
        primaryColor: params.primaryColor,
        tenantName: params.tenantName,
        logoUrl: params.logoUrl,
        title: 'Mensalidade em Atraso',
        body: `
            <p>Olá,</p>
            <div class="alert-box">
                <p style="margin-bottom: 0;">A mensalidade de <strong>${params.mesReferencia}</strong> do(a) aluno(a) <strong>${params.studentName}</strong> está em atraso há <strong>${params.diasAtraso} dias</strong>.<br>
                <strong>Valor:</strong> ${params.valor}</p>
            </div>
            <p>Regularize o pagamento para evitar a suspensão da matrícula. Caso precise de ajuda, entre em contato com a secretaria.</p>
            <a href="#" class="button">Regularizar Pagamento</a>
        `,
    });
}

// ============================================
// 6. PAYMENT CONFIRMED EMAIL
// ============================================

export function generatePaymentConfirmedEmailHtml(params: {
    tenantName: string;
    primaryColor: string;
    logoUrl?: string;
    studentName: string;
    valor: string;
    mesReferencia: string;
}) {
    return emailWrapper({
        primaryColor: params.primaryColor,
        tenantName: params.tenantName,
        logoUrl: params.logoUrl,
        title: 'Pagamento Confirmado',
        body: `
            <p>Olá,</p>
            <div class="success-box">
                <p style="margin-bottom: 0;">Recebemos o pagamento de <strong>${params.valor}</strong> referente à mensalidade de <strong>${params.mesReferencia}</strong> do(a) aluno(a) <strong>${params.studentName}</strong>.</p>
            </div>
            <p>Obrigada pela pontualidade! Até a próxima aula.</p>
        `,
    });
}

// ============================================
// 7. EVENT NOTIFICATION EMAIL
// ============================================

export function generateEventEmailHtml(params: {
    tenantName: string;
    primaryColor: string;
    logoUrl?: string;
    eventTitle: string;
    eventDescription: string;
    eventDate: string;
}) {
    return emailWrapper({
        primaryColor: params.primaryColor,
        tenantName: params.tenantName,
        logoUrl: params.logoUrl,
        title: params.eventTitle,
        body: `
            <p>Olá,</p>
            <div class="info-box">
                <h2 style="margin-top: 0;">${params.eventTitle}</h2>
                <p><strong>Data:</strong> ${params.eventDate}</p>
                <p style="margin-bottom: 0;">${params.eventDescription}</p>
            </div>
            <p>Não perca! Marque na sua agenda e venha participar.</p>
            <a href="#" class="button">Ver no Portal</a>
        `,
    });
}

// ============================================
// 8. SCHEDULE CHANGE EMAIL
// ============================================

export function generateScheduleChangeEmailHtml(params: {
    tenantName: string;
    primaryColor: string;
    logoUrl?: string;
    turmaName: string;
    description: string;
}) {
    return emailWrapper({
        primaryColor: params.primaryColor,
        tenantName: params.tenantName,
        logoUrl: params.logoUrl,
        title: 'Mudança de Horário',
        body: `
            <p>Olá,</p>
            <div class="info-box">
                <p style="margin-bottom: 0;"><strong>Turma:</strong> ${params.turmaName}<br><br>
                ${params.description}</p>
            </div>
            <p>Fique atento ao novo horário. Em caso de dúvidas, entre em contato com a secretaria.</p>
        `,
    });
}

// ============================================
// SEND EMAIL (stub - integrate Resend/SendGrid)
// ============================================

export async function sendBrandedEmail(to: string, subject: string, html: string) {
    // TODO: Integrar com Resend, SendGrid ou outro serviço de e-mail
    // Exemplo com Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // const { data, error } = await resend.emails.send({
    //     from: 'noreply@grandsalto.ia',
    //     to,
    //     subject,
    //     html,
    // })
    console.log(`[Email Service] Enviando e-mail para ${to} com o assunto: ${subject}`);
    return { success: true, messageId: Math.random().toString(36).substring(7) };
}
