import React from "react";
import EmailNotificationList from "@/components/email/EmailNotificationList";

const UserEmailNotificationsPage: React.FC = () => {
  return (
    <div className="user-email-notifications-page">
      <h1>Your Notifications (Buffr Host)</h1>
      <p>View a list of your recent email notifications for Buffr Host.</p>
      <EmailNotificationList />
    </div>
  );
};

export default UserEmailNotificationsPage;
