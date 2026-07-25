create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ai_conversations_user_idx on public.ai_conversations(user_id, updated_at desc);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role public.conversation_role not null,
  content text not null,
  audio_url text,
  created_at timestamptz not null default now()
);

create index ai_messages_conversation_idx on public.ai_messages(conversation_id, created_at);
