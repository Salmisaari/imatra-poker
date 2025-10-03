import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GameRoom {
  id: string;
  room_code: string;
  name: string;
  max_players: number;
  status: string;
  host_id: string;
}

export function useGameRoom() {
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createRoom = async (maxPlayers: number) => {
    setLoading(true);
    try {
      // Generate a random 6-character room code
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('game_rooms')
        .insert({
          room_code: roomCode,
          name: `${user.email?.split('@')[0]}'s Game`,
          max_players: maxPlayers,
          host_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Join the room as host
      await supabase.from('game_room_players').insert({
        room_id: data.id,
        user_id: user.id,
        player_name: user.email?.split('@')[0] || 'Host',
        position: 0,
        is_host: true,
      });

      setCurrentRoom(data);
      
      // Copy link to clipboard
      const shareLink = `${window.location.origin}/?join=${roomCode}`;
      await navigator.clipboard.writeText(shareLink);
      
      toast({
        title: 'Room Created!',
        description: `Room code: ${roomCode}. Link copied to clipboard!`,
      });

      return data;
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: 'Error',
        description: 'Failed to create room',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (roomCode: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Find room by code
      const { data: room, error: roomError } = await supabase
        .from('game_rooms')
        .select()
        .eq('room_code', roomCode)
        .single();

      if (roomError) throw new Error('Room not found');

      // Check if room is full
      const { count } = await supabase
        .from('game_room_players')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', room.id);

      if (count && count >= room.max_players) {
        throw new Error('Room is full');
      }

      // Find next available position
      const { data: existingPlayers } = await supabase
        .from('game_room_players')
        .select('position')
        .eq('room_id', room.id)
        .order('position');

      const usedPositions = existingPlayers?.map(p => p.position) || [];
      const nextPosition = Array.from({ length: room.max_players }, (_, i) => i)
        .find(pos => !usedPositions.includes(pos)) || 0;

      // Join room
      await supabase.from('game_room_players').insert({
        room_id: room.id,
        user_id: user.id,
        player_name: user.email?.split('@')[0] || 'Player',
        position: nextPosition,
      });

      setCurrentRoom(room);
      toast({
        title: 'Joined Room!',
        description: `Welcome to ${room.name}`,
      });

      return room;
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to join room',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const leaveRoom = async () => {
    if (!currentRoom) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('game_room_players')
        .delete()
        .eq('room_id', currentRoom.id)
        .eq('user_id', user.id);

      setCurrentRoom(null);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  return {
    currentRoom,
    loading,
    createRoom,
    joinRoom,
    leaveRoom,
  };
}