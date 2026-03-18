export interface IInvites {
    collectionId: String;
    owner: String;
    inviteeEmail: String;
    status: 'pending' | "accepted" | "declined"
    timestamps: true
}