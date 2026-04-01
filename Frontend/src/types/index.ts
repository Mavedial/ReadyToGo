export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar?: string;
    createdAt: string;
}

export interface Event {
    _id: string;
    title: string;
    description?: string;
    creator: User;
    startDateRange: string;
    endDateRange: string;
    finalDate?: string;
    status: 'planning' | 'voting' | 'confirmed' | 'cancelled';
    invitedUsers: User[];
    participants: User[];
    createdAt: string;
    updatedAt: string;
}

export interface Friendship {
    _id: string;
    requester: User;
    recipient: User;
    status: 'pending' | 'accepted' | 'rejected' | 'blocked';
    createdAt: string;
    respondedAt?: string;
}

export interface EventInvitation {
    _id: string;
    event: Event;
    invitedUser: string;
    invitedBy: User;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: string;
    respondedAt?: string;
}

export interface Availability {
    _id: string;
    event: string;
    user: User;
    availableDates: string[];
    submittedAt: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, consentGiven: boolean) => Promise<void>;    logout: () => void;
    isAuthenticated: boolean;
    updateUserProfile?: (updatedUser: User) => void;
    refreshProfile?: () => Promise<User>;
}