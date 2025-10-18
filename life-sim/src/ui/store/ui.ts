import { defineStore } from 'pinia';

export interface NotificationEntry {
  id: number;
  messageKey: string;
  level: 'info' | 'warning' | 'critical';
}

export interface NeedsSnapshot {
  hunger: number;
  energy: number;
  bladder: number;
  hygiene: number;
  fun: number;
  social: number;
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    buildMode: false,
    paletteOpen: false,
    selectedObjectId: null as string | null,
    funds: 2500,
    notifications: [] as NotificationEntry[],
    nextNotificationId: 1,
    timeScale: 1,
    autonomous: true,
    locale: 'en',
    needs: {
      hunger: 70,
      energy: 70,
      bladder: 70,
      hygiene: 70,
      fun: 70,
      social: 70
    } as NeedsSnapshot,
    timeOfDay: '08:00'
  }),
  actions: {
    toggleBuildMode() {
      this.buildMode = !this.buildMode;
      this.paletteOpen = this.buildMode;
    },
    setBuildMode(value: boolean) {
      this.buildMode = value;
      this.paletteOpen = value;
    },
    selectObject(id: string | null) {
      this.selectedObjectId = id;
    },
    adjustFunds(amount: number) {
      this.funds += amount;
      if (this.funds < 0) this.funds = 0;
    },
    setFunds(amount: number) {
      this.funds = Math.max(0, amount);
    },
    addNotification(messageKey: string, level: NotificationEntry['level'] = 'info') {
      const entry: NotificationEntry = {
        id: this.nextNotificationId++,
        messageKey,
        level
      };
      this.notifications.push(entry);
      setTimeout(() => {
        this.removeNotification(entry.id);
      }, 4000);
    },
    removeNotification(id: number) {
      this.notifications = this.notifications.filter((note) => note.id !== id);
    },
    setTimeScale(scale: number) {
      this.timeScale = scale;
    },
    setAutonomous(value: boolean) {
      this.autonomous = value;
    },
    setLocale(locale: string) {
      this.locale = locale;
    },
    updateNeeds(needs: NeedsSnapshot) {
      this.needs = { ...needs };
    },
    setTimeOfDay(hours: number, minutes: number) {
      this.timeOfDay = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
    }
  }
});
