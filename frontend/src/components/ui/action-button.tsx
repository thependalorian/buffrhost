"use client";

/**
 * Universal Action Button Component for Buffr Host Platform
 *
 * A comprehensive action button component with modal triggers, loading states,
 * and various action types for use across the entire application.
 */

import React, { useState } from "react";
import { Button } from "./button";
import { Modal, ModalForm } from "./modal";
import { LoadingSpinner } from "./loading";
import { cn } from "../../lib/utils";

export interface ActionButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  tooltip?: string;
}

export interface ModalActionButtonProps extends ActionButtonProps {
  modalTitle: string;
  modalDescription?: string;
  modalContent: React.ReactNode;
  modalSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  onSubmit?: (data: FormData) => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
}

export interface ConfirmActionButtonProps extends ActionButtonProps {
  confirmTitle: string;
  confirmDescription?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  variant?: "default" | "destructive";
}

const ActionButton: React.FC<ActionButtonProps> = ({
  variant = "default",
  size = "default",
  children,
  onClick,
  href,
  disabled = false,
  loading = false,
  className,
  icon,
  iconPosition = "left",
  tooltip,
}) => {
  const buttonContent = (
    <>
      {loading && <LoadingSpinner size="sm" />}
      {!loading && icon && iconPosition === "left" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
      {!loading && icon && iconPosition === "right" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </>
  );

  if (href) {
    return (
      <Button
        variant={variant}
        size={size}
        asChild
        disabled={disabled || loading}
        className={className}
        title={tooltip}
      >
        <a href={href}>{buttonContent}</a>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      title={tooltip}
    >
      {buttonContent}
    </Button>
  );
};

const ModalActionButton: React.FC<ModalActionButtonProps> = ({
  modalTitle,
  modalDescription,
  modalContent,
  modalSize = "lg",
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  children,
  ...buttonProps
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (data: FormData) => {
    if (onSubmit) {
      await onSubmit(data);
    }
    setIsOpen(false);
  };

  return (
    <>
      <ActionButton {...buttonProps} onClick={() => setIsOpen(true)}>
        {children}
      </ActionButton>

      {onSubmit ? (
        <ModalForm
          open={isOpen}
          onOpenChange={setIsOpen}
          title={modalTitle}
          description={modalDescription}
          size={modalSize}
          onSubmit={handleSubmit}
          submitText={submitText}
          cancelText={cancelText}
        >
          {modalContent}
        </ModalForm>
      ) : (
        <Modal
          open={isOpen}
          onOpenChange={setIsOpen}
          title={modalTitle}
          description={modalDescription}
          size={modalSize}
        >
          {modalContent}
        </Modal>
      )}
    </>
  );
};

const ConfirmActionButton: React.FC<ConfirmActionButtonProps> = ({
  confirmTitle,
  confirmDescription,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
  children,
  ...buttonProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error("Confirmation action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ActionButton
        {...buttonProps}
        variant={variant}
        onClick={() => setIsOpen(true)}
      >
        {children}
      </ActionButton>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title={confirmTitle}
        description={confirmDescription}
        size="sm"
      >
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export { ActionButton, ModalActionButton, ConfirmActionButton };
