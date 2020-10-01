import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import React from 'react';
import {
    messagesQuery,
    addMessageMutation,
    messageAddedSubscription,
} from './graphql/queries';

import MessageInput from './MessageInput';
import MessageList from './MessageList';

function useChatMessages() {
    const { data } = useQuery(messagesQuery);
    const messages = data ? data.messages : [];

    useSubscription(messageAddedSubscription, {
        onSubscriptionData: ({ client, subscriptionData }) => {
            client.writeData({
                data: {
                    messages: messages.concat(
                        subscriptionData.data.messageAdded
                    ),
                },
            });
        },
    });

    const [addMessage] = useMutation(addMessageMutation);

    return {
        messages,
        addMessage: (text) => addMessage({ variables: { input: { text } } }),
    };
}

const Chat = ({ user }) => {
    const { messages, addMessage } = useChatMessages();

    return (
        <section className='section'>
            <div className='container'>
                <h1 className='title'>Chatting as {user}</h1>
                <MessageList user={user} messages={messages} />
                <MessageInput onSend={addMessage} />
            </div>
        </section>
    );
};

export default Chat;
