"use client";

import AIStudioModal from "@/components/modals/ai-studio-modal";
import ProfileModal from "@/components/modals/profile-modal";

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}

      <AIStudioModal />

      <ProfileModal />
    </>
  );
}