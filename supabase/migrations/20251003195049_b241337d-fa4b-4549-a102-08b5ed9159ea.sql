-- Update RLS policies to allow anonymous access for social gaming

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Anyone can view game rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "Authenticated users can create game rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "Hosts can update their game rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "Hosts can delete their game rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "Anyone can view players in game rooms" ON public.game_room_players;
DROP POLICY IF EXISTS "Users can join game rooms" ON public.game_room_players;
DROP POLICY IF EXISTS "Users can leave game rooms" ON public.game_room_players;
DROP POLICY IF EXISTS "Anyone can view game states" ON public.game_states;
DROP POLICY IF EXISTS "Hosts can update game states" ON public.game_states;
DROP POLICY IF EXISTS "Hosts can insert game states" ON public.game_states;

-- Allow anonymous users to play (no auth required)
-- Make host_id nullable for anonymous games
ALTER TABLE public.game_rooms ALTER COLUMN host_id DROP NOT NULL;

-- Remove user_id foreign key constraint to allow anonymous players
ALTER TABLE public.game_room_players DROP CONSTRAINT IF EXISTS game_room_players_user_id_fkey;
ALTER TABLE public.game_room_players ALTER COLUMN user_id DROP NOT NULL;

-- Create new public policies for anonymous social gaming
CREATE POLICY "Anyone can view game rooms"
  ON public.game_rooms FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create game rooms"
  ON public.game_rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update game rooms"
  ON public.game_rooms FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete game rooms"
  ON public.game_rooms FOR DELETE
  USING (true);

CREATE POLICY "Anyone can view players"
  ON public.game_room_players FOR SELECT
  USING (true);

CREATE POLICY "Anyone can join game rooms"
  ON public.game_room_players FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update players"
  ON public.game_room_players FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can leave game rooms"
  ON public.game_room_players FOR DELETE
  USING (true);

CREATE POLICY "Anyone can view game states"
  ON public.game_states FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update game states"
  ON public.game_states FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can insert game states"
  ON public.game_states FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete game states"
  ON public.game_states FOR DELETE
  USING (true);