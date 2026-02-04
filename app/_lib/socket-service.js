'use server';

import { createClient } from '@supabase/supabase-js';
import { auth } from '../_lib/auth';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export async function loadRoomMessages({ roomName = 'General Room', roomId }) {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  // Step 4: Load messages
  const { data: messages, error: msgError } = await supabaseAdmin
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (msgError) throw msgError;

  return messages || [];
}

export async function uploadMessage(payload) {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  if (!payload?.room_id) {
    throw new Error('Missing room_id in payload');
  }


  // Insert message with correct user_id
  const messageToInsert = {
    ...payload,
    user_id: session.user.id,
  };

  const { data, error } = await supabaseAdmin.from('messages').insert([messageToInsert]).select();

  if (error) throw error;

  return data[0];
}

export async function retriveRoomRecord() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const { data: room, error } = await supabaseAdmin
    .from('rooms')
    .select('*')
    .eq('name', 'General Room');

  return room?.[0].id || null;
}

export async function updateVisitorInOutFlow({ loggedIn, anonymous }) {
  const updateData = {};

  if (loggedIn !== undefined) {
    updateData.logged_in = loggedIn;
  }

  if (anonymous !== undefined) {
    updateData.anonymous = anonymous;
  }

  const { data, error } = await supabaseAdmin
    .from('live_visitors')
    .update(updateData)
    .eq('id', 1)
    .select();

  if (error) {
    throw new Error("error updating visitor's data: " + error.message);
  }

  return data;
}
