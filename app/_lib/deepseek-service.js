'use server';
import OpenAI from 'openai';
import { auth } from '../_lib/auth';
import { getPokemons } from '../_lib/data-service';
import { searchSimilarChats, generateSupabaseQuery, executeSupabaseQuery } from './vector-service';
import { supabase } from './supabase';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function deepSeekApiQuery(content, chatHistory = []) {
  const model = 'deepseek-chat';
  const session = await auth();
  let reply;
  let pastChatRecord = [];
  try {
    const products = (await getPokemons())?.data || [];

    if (session?.user?.id) {
      const { data: pastChatRecords, error: loadingPastChatRecord } = await supabase
        .from('ai_chat_records')
        .select('*')
        .eq('userId', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      let serializedPastRecords = pastChatRecords.map((record) => {
        let temp = { ...record };
        temp.message.answer = JSON.stringify(temp.message.answer);

        return temp;
      });

      pastChatRecord = serializedPastRecords;
    }

    // Step 1: Ask DeepSeek to generate a Supabase query
    const queryDesc = await generateSupabaseQuery(content.trim());
    let relevantProducts = [];

    // Step 2: Execute the query against your Supabase
    if (queryDesc && !queryDesc.error) {
      relevantProducts = await executeSupabaseQuery(queryDesc);
    }

    // Step 3: Fallback to keyword search if DeepSeek query failed
    if (relevantProducts.length === 0) {
      try {
        relevantProducts = await searchRelevantProducts(content.trim(), 10);
      } catch (e) {
        console.warn('Fallback search skipped:', e.message);
      }
    }

    // Build simplified product list from vector results only
    const simplifiedProducts = relevantProducts.map((p) => ({
      id: p.id,
      name: p.name,
      species: p.species,
      description: p.descriptions,
      hp: p.hp,
      attack: p.attack,
      defense: p.defense,
      special_attack: p.special_attack,
      special_defense: p.special_defense,
      speed: p.speed,
      image: p.image,
    }));

    // Retrieve vector context BEFORE building system message
    let vectorContext = '';
    try {
      const similarChats = await searchSimilarChats(content.trim(), 3);
      if (similarChats?.length > 0) {
        vectorContext = similarChats.map((c) => `[Similar past interaction]: ${c.content}`).join('\n');
      }
    } catch (e) {
      console.warn('Vector search skipped:', e.message);
    }

    // Include anonymous chat history for context
    const anonHistory = chatHistory.length > 0
      ? `\n\nRecent conversation context with this customer:\n${chatHistory.map((m, i) => `Turn ${i + 1}: Customer: "${m.question}" | You replied: "${typeof m.answer?.text === 'string' ? m.answer.text : ''}"`).join("\n")}\n\nUse the above context to maintain conversation continuity.`
      : "";

    const pastContext = pastChatRecord.length > 0
      ? `\n\nPast chat records with this customer:\n${JSON.stringify(pastChatRecord)}`
      : "";

    const systemMessage = {
      role: "system",
      content: `You must respond with ONLY a valid JSON object (starting with '{' and ending with '}', no prefix or extra ending) containing two fields: "text" (your message to the customer) and "suggestion" (array of suggested Pokémon objects with id, name, image).

You are a helpful sales assistant for Poke 芒. Drive sales of these products when relevant: ${JSON.stringify(simplifiedProducts)}.

If the query is unrelated to shopping, reply in 30 words or fewer.
Match the language used by the customer.${anonHistory}${pastContext}
${vectorContext ? `\n\nVector context from similar conversations: ${vectorContext}` : ""}
${session?.user?.name ? `\n\nThe customer's name is: ${session.user.name.split(" ")[0]}` : ""}`,
    };

    const userMessage = { role: 'user', content: content.trim() };

    const completion = await openai.chat.completions.create({
      model,
      messages: [systemMessage, userMessage],
      temperature: 0.7,
    });

    let rawAnswer = completion.choices[0]?.message?.content?.trim() || '';

    let parsedAnswer;
    try {
      parsedAnswer = JSON.parse(rawAnswer);
      const { text } = parsedAnswer;
      reply = text;
    } catch (e) {
      parsedAnswer = { text: rawAnswer || 'Sorry, no response generated.', suggestion: [] };
    }

    if (session?.user?.id) {
      const { data, error } = await supabase
        .from('ai_chat_records')
        .insert([
          {
            userId: session.user.id,
            message: {
              question: content.trim(),
              answer: reply,
            },
          },
        ])
        .select();
    }

    return {
      question: content.trim(),
      answer: parsedAnswer,
      id: completion.id,
      created: completion.created,
    };
  } catch (err) {
    console.error('DeepSeek API error:', err);
    return {
      question: content.trim(),
      answer: {
        text: 'Sorry, we are experiencing technical difficulties. Please try again later.',
        suggestion: [],
      },
      id: null,
      created: Date.now(),
    };
  }
}
