import React from 'react'
import { useAuth, useUser } from '@clerk/react';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { syncUser } from '../lib/api';

function useUserSync() {
    const { isSignedIn } = useAuth();
    const { user } = useUser();

    const { mutate: synUserMutation, isPending, isSuccess } = useMutation({ mutationFn:syncUser })

    useEffect(() => {
        if (isSignedIn && user && !isPending && !isSuccess) {
            synUserMutation({
                email: user.primaryEmailAddress.emailAddress,
                name: user.fullName || user.firstName,
                imageUrl: user.imageUrl,
            })
        }
    })

    return {};
}

export default useUserSync
