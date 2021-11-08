import React from 'react';
import { Box, Button, TextInput } from 'grommet';
import { saveItem, USERNAME_KEY } from '../utils/storage';
interface Props {
  roomId: string;
  username: string;
  updateRoomId?: (value: string) => void;
  updateUsername: (value: string) => void;
  updateTokens: (tokens: { clientToken: string; refreshToken: string }) => void;
}

const JoinRoom = ({
  roomId,
  username,
  updateRoomId,
  updateUsername,
  updateTokens,
}: Props) => {
  const joinRoom = async () => {
    const response = await fetch('/api/client_token', {
      method: 'POST',
      body: JSON.stringify({
        room_id: roomId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();

      updateTokens({
        clientToken: data.token,
        refreshToken: data.refresh_token,
      });
    }
  };

  return (
    <Box direction='row' justify='center'>
      <Box pad='small' gap='medium'>
        <Box
          background={{ color: 'white', opacity: 'weak' }}
          round='xsmall'
          pad='small'
        >
          Enter the Room UUID and choose a name for yourself
        </Box>
        <TextInput
          data-testid='input-room-uuid'
          value={roomId}
          onChange={(e) => {
            if (typeof updateRoomId === 'function') {
              updateRoomId(e.target.value);
            }
          }}
          placeholder={'Room UUID'}
        />

        <TextInput
          data-testid='input-username'
          value={username}
          onChange={(e) => {
            updateUsername(e.target.value);
          }}
          placeholder='Your name'
        />
        <Button
          data-testid='btn-join-room'
          primary
          disabled={!roomId}
          label='Join room'
          onClick={() => {
            saveItem(USERNAME_KEY, username);
            joinRoom();
          }}
        />
      </Box>
    </Box>
  );
};

export default JoinRoom;
