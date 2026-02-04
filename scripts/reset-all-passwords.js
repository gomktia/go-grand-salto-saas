
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const USERS_TO_RESET = [
    'diretora@espacorevelle.com.br',
    'professor@espacorevelle.com.br',
    'aluno@espacorevelle.com.br',
    'pai@espacorevelle.com.br'
];

const NEW_PASSWORD = 'revelle_reset_123';

async function resetAllPasswords() {
    console.log('Iniciando reset de senhas para usuários de teste...');

    // List all users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Erro ao listar usuários:', listError.message);
        return;
    }

    for (const email of USERS_TO_RESET) {
        const user = users.find(u => u.email === email);

        if (!user) {
            console.warn(`Usuário ${email} não encontrado no Supabase. Pulando...`);
            continue;
        }

        console.log(`Resetando senha para ${email}...`);
        const { error } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: NEW_PASSWORD }
        );

        if (error) {
            console.error(`Erro ao atualizar ${email}:`, error.message);
        } else {
            console.log(`Sucesso: Senha de ${email} atualizada.`);
        }
    }

    console.log('Concluído!');
}

resetAllPasswords();
