import { ActionArgs, LoaderArgs, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import createServerSupabase from 'utils/supabase.server';
import Login from '~/components/Login';
import RealTimeMessages from '~/components/RealTimeMessages';

export const action = async ({ request }: ActionArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  const { message } = Object.fromEntries(await request.formData());

  const { error } = await supabase
    .from('messages')
    .insert({ content: String(message) });

  if (error) {
    console.log(error);
  }

  return json(null, { headers: response.headers });
};

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const { data: messages, error } = await supabase.from('messages').select();

  if (error) {
    throw new Error('An error occured while fetching the messages');
  }

  return json({ messages }, { headers: response.headers });
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();

  return (
    <>
      <Login />
      <RealTimeMessages serverMessages={messages} />
      <Form method="post">
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </Form>
    </>
  );
}
