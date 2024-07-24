import { CallingState, StreamCall, StreamVideo, StreamVideoClient, useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

const apiKey = 'mmhfdzb5evj2';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiSmFiYmFfVGhlX0h1dHQiLCJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0phYmJhX1RoZV9IdXR0IiwiaWF0IjoxNzIxMDA5OTUzLCJleHAiOjE3MjE2MTQ3NTh9.A52b9CdAUeXY1CCgaPUuz0ojsn3Ta0ngGwboC96Dgx4';
const userId = 'Jabba_The_Hutt';
const callId = '6RyTwrTOZQk9';

// set up the user object
const user= {
  id: userId,
  name: 'Oliver',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', callId);
call.join({ create: true });

export default function App() {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
}

export const MyUILayout = () => {
  const call = useCall();

  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>;
  }

  return (
      <div>
        Call &quot;{call.id}&quot; has {participantCount} participants
      </div>
    );
};