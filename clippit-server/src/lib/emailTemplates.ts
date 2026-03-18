export const sendInviteTemplate = (collectionName: string) => {
    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #333;">You've been invited!</h2>
            <p style="color: #555; font-size: 16px;">
                You have been invited to collaborate on the collection <strong>${collectionName || 'a collection'}</strong> on Clippit.
            </p>
            <p style="color: #555; font-size: 16px;">
                Click the button below to view the collection and join the workspace.
            </p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/collections" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                    View Collection
                </a>
            </div>
            <p style="color: #999; font-size: 14px; margin-top: 30px; text-align: center;">
                If you did not expect this invitation, you can safely ignore this email.
            </p>
        </div>
    `;
}