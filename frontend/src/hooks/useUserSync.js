import React from 'react'
import { useAuth, useUser } from '@clerk/react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { syncUser } from '../lib/api';

function useUserSync() {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const syncedUserIdRef = useRef(null);

    // const { mutate: synUserMutation, isPending, isSuccess } = useMutation({ mutationFn:syncUser })
    const { mutate: syncUserMutation } = useMutation({ mutationFn: syncUser })

    useEffect(() => {
        const email = user?.primaryEmailAddress?.emailAddress;
            if (!isSignedIn || !user || !email || syncedUserIdRef.current === user.id) return;

            syncedUserIdRef.current = user.id;
            syncUserMutation(
                {
                    email,
                    name: user.fullName || user.firstName,
                    imageUrl: user.imageUrl,
                },
                {
                    onError: () => {
                        syncedUserIdRef.current = null;
                    },
                }
            );
    }, [
        isSignedIn, 
        user?.id,
        user?.primaryEmailAddress?.emailAddress,
        user?.fullName,
        user?.firstName,
        user?.imageUrl,
        syncUserMutation
    ])

    return {};
}

export default useUserSync
