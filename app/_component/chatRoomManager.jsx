'use client';

import PersonIcon from '@mui/icons-material/Person';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function ChatRoomManager() {
  const [loggedInUser, setLoggedInUser] = useState(0);
  const [anonymousUser, setAnonymousUser] = useState(0);

  useEffect(() => {
    // Initial fetch of current counts
    const fetchInitialCounts = async () => {
      const { data, error } = await supabase
        .from('live_visitors')
        .select('anonymous, logged_in')
        .single(); // Assumes one row holding the totals

      if (error) {
        console.error('Error fetching initial counts:', error);
        return;
      }
      if (data) {
        setAnonymousUser(data.anonymous ?? 0);
        setLoggedInUser(data.logged_in ?? 0);
      }
    };

    fetchInitialCounts();

    // Realtime subscription
    const channel = supabase.channel('visitors');

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_visitors',
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            // Safety: reset if row is deleted (unlikely for singleton)
            setAnonymousUser(0);
            setLoggedInUser(0);
            return;
          }

          const newAnon = payload.new?.anonymous ?? 0;
          const newLogged = payload.new?.logged_in ?? 0;

          setAnonymousUser(newAnon);
          setLoggedInUser(newLogged);
        }
      )
      .subscribe((status) => {
        console.log('channel status:', status);
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const needToShowManager = anonymousUser > 1 || loggedInUser > 1;

  if (!needToShowManager) return null;

  return (
    <div className="flex gap-2 items-center">
      <strong className="text-[10px] text-yellow-300">Chat 芒</strong>

      {anonymousUser > 1 && (
        <div className="bg-white text-primary-900 px-3 py-1 rounded-full flex gap-2 items-center">
          <div className="flex gap-1 items-center">
            <div className={`flex flex-col justify-center items-center`}>
              <img src="/anonymous.png" alt="anonymous" className="w-6 h-6" />
              <p className={`text-[8px]`}>Anonymus</p>
            </div>
            {anonymousUser}
          </div>
        </div>
      )}

      {loggedInUser > 1 && (
        <div className="bg-green-400 px-3 py-1 rounded-full flex gap-2 items-center">
          <div className="flex gap-1 items-center">
            <div className={`flex flex-col justify-center items-center`}>
              <PersonIcon className={`h-1 w-1`} />
              <p className={`text-[8px]`}>Logged In</p>
            </div>
            {loggedInUser}
          </div>
        </div>
      )}
    </div>
  );
}
