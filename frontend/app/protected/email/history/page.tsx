import React from "react";
import EmailHistory from "@/components/email/EmailHistory";

const UserEmailHistoryPage: React.FC = () => {
  return (
    <div className="user-email-history-page">
      <h1>Email History (Buffr Host)</h1>
      <p>View a log of all emails sent to you for Buffr Host.</p>
      <EmailHistory />
    </div>
  );
};

export default UserEmailHistoryPage;
