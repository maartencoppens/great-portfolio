'use client';
// Gedeelde chat-toestand tussen de 3D-scene (klikbare objecten, camera) en de HTML-chat.
import { useSyncExternalStore } from 'react';

export type Rect = { left: number; top: number; width: number; height: number };

type ChatState = {
  open: boolean;
  /** Vraag die automatisch verstuurd wordt (bij klikken op een object). */
  pending?: string | undefined;
  /** Waar het laptopscherm op het scherm staat, zodra de camera is ingezoomd. */
  rect: Rect | null;
};

let state: ChatState = { open: false, rect: null };
const subs = new Set<() => void>();

export const chatStore = {
  get: () => state,
  set(patch: Partial<ChatState>) {
    state = { ...state, ...patch };
    subs.forEach((f) => f());
  },
  subscribe(f: () => void) {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

export const useChat = () => useSyncExternalStore(chatStore.subscribe, chatStore.get);
export const openChat = (question?: string) =>
  state.open ? chatStore.set({ pending: question }) : chatStore.set({ open: true, pending: question, rect: null });
export const closeChat = () => chatStore.set({ open: false, pending: undefined, rect: null });
