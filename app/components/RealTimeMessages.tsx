import { useOutletContext } from '@remix-run/react';
import { useEffect, useState } from 'react';
import type { Database } from 'types/supabase';
import { SupabaseOutletContext } from '~/root';

type Message = Database['public']['Tables']['messages']['Row'];

const RealTimeMessages = ({
  serverMessages,
}: {
  serverMessages: Message[];
}) => {
  const [messages, setMessages] = useState(serverMessages);
  const { supabase } = useOutletContext<SupabaseOutletContext>();

  useEffect(() => {
    setMessages(serverMessages);
  }, [serverMessages]);

  useEffect(() => {
    const channel = supabase
      .channel('*')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;

          if (!messages.find((message) => message.id === newMessage.id)) {
            setMessages([...messages, newMessage]);
          }
        }
      )
      .subscribe();

    () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, messages, setMessages]);
  return <pre>{JSON.stringify(messages, null, 2)}</pre>;
};

export default RealTimeMessages;
