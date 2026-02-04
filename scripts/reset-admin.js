
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetPassword() {
    const email = 'diretora@espacorevelle.com.br';
    const newPassword = 'revelle_reset_123';

    console.log(`Tentando resetar senha para ${email}...`);

    // First, list users to verify connection and user existence
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Erro ao listar usuários. Verifique as chaves (URL/Service Role):', listError.message);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error(`Usuário ${email} não encontrado neste projeto Supabase.`);
        console.log('Usuários encontrados:', users.map(u => u.email));
        return;
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
    );

    if (error) {
        console.error('Erro ao atualizar senha:', error.message);
    } else {
        console.log(`Sucesso! A senha para ${email} foi alterada para: ${newPassword}`);
    }
}

resetPassword();
