import { Colors } from './colors';

export const clerkAppearance = {
  variables: {
    colorPrimary: Colors.primary,
    colorBackground: Colors.surface,
    colorText: Colors.text,
    colorTextSecondary: Colors.textSecondary,
    borderRadius: '12px',
  },
  elements: {
    rootBox: { width: '100%', maxWidth: 400 },
    card: {
      backgroundColor: Colors.surface,
      boxShadow: 'none',
      border: `1px solid ${Colors.border}`,
      borderRadius: '16px',
      padding: '24px',
    },
    headerTitle: {
      color: Colors.text,
      fontSize: '22px',
      fontWeight: '700',
    },
    headerSubtitle: {
      color: Colors.textSecondary,
    },
    formFieldInput: {
      backgroundColor: Colors.surfaceLight,
      color: Colors.text,
      border: `1px solid ${Colors.border}`,
      borderRadius: '10px',
      padding: '12px 14px',
      fontSize: '15px',
      '&:focus': {
        border: `1px solid ${Colors.primary}`,
        boxShadow: `0 0 0 2px ${Colors.primary}33`,
      },
    },
    formFieldLabel: {
      color: Colors.textSecondary,
      fontSize: '13px',
      fontWeight: '600',
    },
    formButtonPrimary: {
      backgroundColor: Colors.primary,
      borderRadius: '10px',
      padding: '12px',
      fontSize: '15px',
      fontWeight: '600',
      '&:hover': { backgroundColor: Colors.primaryDark },
      '&:active': { backgroundColor: Colors.primaryDark },
    },
    socialButtonsBlockButton: {
      backgroundColor: Colors.surfaceLight,
      color: Colors.text,
      border: `1px solid ${Colors.border}`,
      borderRadius: '10px',
      padding: '10px',
      '&:hover': { backgroundColor: Colors.surfaceHover },
    },
    socialButtonsBlockButtonText: {
      color: Colors.text,
      fontSize: '14px',
      fontWeight: '500',
    },
    dividerLine: {
      backgroundColor: Colors.border,
    },
    dividerText: {
      color: Colors.textMuted,
      fontSize: '13px',
    },
    footerActionLink: {
      color: Colors.primary,
      fontSize: '13px',
      '&:hover': { color: Colors.primaryLight },
    },
    footerActionText: {
      color: Colors.textMuted,
      fontSize: '13px',
    },
    formFieldErrorText: {
      color: Colors.error,
      fontSize: '12px',
    },
    formFieldSuccessText: {
      color: Colors.success,
      fontSize: '12px',
    },
    logoBox: {
      display: 'none',
    },
    otpCodeFieldInput: {
      backgroundColor: Colors.surfaceLight,
      color: Colors.text,
      border: `1px solid ${Colors.border}`,
    },
    identityPreview: {
      backgroundColor: Colors.surfaceLight,
      color: Colors.text,
      border: `1px solid ${Colors.border}`,
    },
    formResendCodeLink: {
      color: Colors.primary,
    },
  },
};
