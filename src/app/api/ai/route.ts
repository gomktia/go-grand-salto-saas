import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Permite streaming de texto para uma experiência premium (estilo ChatGPT)
export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { eventName, description, studentHighlights } = await req.json();

        // Contexto rico para a IA entender o nicho de Ballet e o cliente Espaço Revelle
        const systemPrompt = `
      Você é um especialista em Marketing e SEO para Escolas de Balé de Luxo. 
      Seu objetivo é escrever posts de blog emocionantes e profissionais para o blog da escola "Espaço Revelle" em Santa Maria - RS.
      
      Diretrizes:
      1. Use um tom elegante, inspirador e acolhedor.
      2. Foque no progresso técnico e emocional dos alunos.
      3. Inclua palavras-chave de SEO como "Ballet em Santa Maria", "Dança para crianças", "Espaço Revelle Ballet".
      4. O post deve terminar com uma chamada para ação (CTA) para agendar uma aula experimental.
    `;

        const result = await streamText({
            model: openai('gpt-4o'),
            system: systemPrompt,
            prompt: `Crie um post de blog sobre o evento "${eventName}". 
               Descrição: ${description}. 
               Destaques das alunas: ${studentHighlights}.
               Gere um título chamativo e um conteúdo dividido em parágrafos.`,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Falha ao conectar com a IA. Verifique sua OPENAI_API_KEY.' }), { status: 500 });
    }
}
