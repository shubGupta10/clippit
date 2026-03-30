export interface Item {
  _id: string;
  userId: string;
  type: 'text' | 'image' | 'link';
  title?: string;
  content?: string;
  imageUrl?: string;
  sourceUrl: string;
  tags: string[];
  note?: string;
  collectionId?: { _id: string, name: string } | null;
  pageTitle?: string;
  pageDescription?: string;
  isEmbedded: boolean;
  createdAt: string;
}

export interface GroupedItem {
  label: string;
  items: Item[];
}

export interface Collection {
  _id: string;
  name: string;
  owner: { _id: string; clerkId: string; firstName: string; lastName: string; email: string };
  members: { _id: string; clerkId: string; firstName: string; lastName: string }[];
  itemIds: Item[];
  createdAt: string;
  updatedAt: string;
}

export interface Invite {
  _id: string;
  collectionId: { _id: string, name: string };
  owner: { firstName: string; lastName: string; email: string };
  inviteeEmail: string;
  status: string;
}
export interface User {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  plan: string;
  subscription: {
    status: string;
    planId: string;
    subscriptionId: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  };
  role: string;
  onboardingComplete: boolean;
  createdAt: string;
}
