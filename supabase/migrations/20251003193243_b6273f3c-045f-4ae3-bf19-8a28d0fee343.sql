-- Create game rooms table
CREATE TABLE public.game_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code text UNIQUE NOT NULL,
  host_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  max_players integer NOT NULL DEFAULT 6,
  small_blind integer NOT NULL DEFAULT 10,
  big_blind integer NOT NULL DEFAULT 20,
  starting_chips integer NOT NULL DEFAULT 1000,
  status text NOT NULL DEFAULT 'waiting',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('waiting', 'in_progress', 'finished'))
);

-- Create game room players table
CREATE TABLE public.game_room_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.game_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  player_name text NOT NULL,
  chips integer NOT NULL DEFAULT 1000,
  position integer NOT NULL,
  is_host boolean NOT NULL DEFAULT false,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id),
  UNIQUE(room_id, position)
);

-- Create game states table for real-time sync
CREATE TABLE public.game_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.game_rooms(id) ON DELETE CASCADE UNIQUE NOT NULL,
  current_phase text NOT NULL DEFAULT 'waiting',
  pot integer NOT NULL DEFAULT 0,
  current_bet integer NOT NULL DEFAULT 0,
  community_cards jsonb NOT NULL DEFAULT '[]'::jsonb,
  active_player_position integer,
  dealer_position integer NOT NULL DEFAULT 0,
  last_action jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_states ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_rooms
CREATE POLICY "Anyone can view game rooms"
  ON public.game_rooms FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create game rooms"
  ON public.game_rooms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their game rooms"
  ON public.game_rooms FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their game rooms"
  ON public.game_rooms FOR DELETE
  TO authenticated
  USING (auth.uid() = host_id);

-- RLS Policies for game_room_players
CREATE POLICY "Anyone can view players in game rooms"
  ON public.game_room_players FOR SELECT
  USING (true);

CREATE POLICY "Users can join game rooms"
  ON public.game_room_players FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave game rooms"
  ON public.game_room_players FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for game_states
CREATE POLICY "Anyone can view game states"
  ON public.game_states FOR SELECT
  USING (true);

CREATE POLICY "Hosts can update game states"
  ON public.game_states FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.game_rooms
      WHERE game_rooms.id = game_states.room_id
      AND game_rooms.host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can insert game states"
  ON public.game_states FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.game_rooms
      WHERE game_rooms.id = game_states.room_id
      AND game_rooms.host_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_game_rooms_room_code ON public.game_rooms(room_code);
CREATE INDEX idx_game_rooms_host_id ON public.game_rooms(host_id);
CREATE INDEX idx_game_room_players_room_id ON public.game_room_players(room_id);
CREATE INDEX idx_game_room_players_user_id ON public.game_room_players(user_id);
CREATE INDEX idx_game_states_room_id ON public.game_states(room_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_game_rooms_updated_at
  BEFORE UPDATE ON public.game_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_states_updated_at
  BEFORE UPDATE ON public.game_states
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for multiplayer sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_room_players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_states;