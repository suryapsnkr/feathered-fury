/**
 * achievements.js - Standalone Achievement Tracker for direct browser loading.
 */
(function(window) {
  const ACHIEVEMENTS = [
    {
      id: 'first_flight',
      title: 'First Flight',
      description: 'Launch your very first bird from the slingshot.',
      icon: '🚀',
      category: 'basics'
    },
    {
      id: 'timber_cutter',
      title: 'Lumberjack',
      description: 'Destroy 5 wooden blocks.',
      icon: '🪓',
      category: 'destruction'
    },
    {
      id: 'ice_breaker',
      title: 'Ice Breaker',
      description: 'Shatter 5 fragile glass blocks.',
      icon: '🧊',
      category: 'destruction'
    },
    {
      id: 'demolition',
      title: 'Demolition Expert',
      description: 'Trigger a massive TNT explosion.',
      icon: '💥',
      category: 'destruction'
    },
    {
      id: 'pig_popper',
      title: 'Bacon Maker',
      description: 'Defeat 5 mischievous green pigs.',
      icon: '🐷',
      category: 'combat'
    },
    {
      id: 'citadel_conqueror',
      title: 'Crown Fall',
      description: 'Defeat King Pig in Level 5.',
      icon: '👑',
      category: 'combat'
    },
    {
      id: 'three_stars',
      title: 'Perfectionist',
      description: 'Earn 3 stars on any single level.',
      icon: '⭐',
      category: 'mastery'
    },
    {
      id: 'grand_master',
      title: 'Grand Master',
      description: 'Collect all 15 stars across all 5 levels.',
      icon: '🏆',
      category: 'mastery'
    }
  ];

  const AchievementTracker = {
    getUnlocked() {
      if (typeof window === 'undefined') return [];
      try {
        return JSON.parse(localStorage.getItem('angry_birds_achievements') || '[]');
      } catch {
        return [];
      }
    },

    isUnlocked(id) {
      return this.getUnlocked().includes(id);
    },

    unlock(id) {
      if (typeof window === 'undefined') return false;
      const unlocked = this.getUnlocked();
      if (!unlocked.includes(id)) {
        unlocked.push(id);
        localStorage.setItem('angry_birds_achievements', JSON.stringify(unlocked));
        window.dispatchEvent(new CustomEvent('angry_birds_achievement_unlocked', { detail: { id } }));
        return true;
      }
      return false;
    },

    getStats() {
      if (typeof window === 'undefined') return { pigsDefeated: 0, blocksDestroyed: 0, glassDestroyed: 0, birdsLaunched: 0, tntDetonated: 0 };
      try {
        return JSON.parse(localStorage.getItem('angry_birds_stats') || '{"pigsDefeated":0,"blocksDestroyed":0,"glassDestroyed":0,"birdsLaunched":0,"tntDetonated":0}');
      } catch {
        return { pigsDefeated: 0, blocksDestroyed: 0, glassDestroyed: 0, birdsLaunched: 0, tntDetonated: 0 };
      }
    },

    recordStat(key, amount = 1) {
      if (typeof window === 'undefined') return;
      const stats = this.getStats();
      stats[key] = (stats[key] || 0) + amount;
      localStorage.setItem('angry_birds_stats', JSON.stringify(stats));

      if (key === 'birdsLaunched' && stats.birdsLaunched >= 1) {
        this.unlock('first_flight');
      }
      if (key === 'blocksDestroyed' && stats.blocksDestroyed >= 5) {
        this.unlock('timber_cutter');
      }
      if (key === 'glassDestroyed' && stats.glassDestroyed >= 5) {
        this.unlock('ice_breaker');
      }
      if (key === 'pigsDefeated' && stats.pigsDefeated >= 5) {
        this.unlock('pig_popper');
      }
      if (key === 'tntDetonated' && stats.tntDetonated >= 1) {
        this.unlock('demolition');
      }
    }
  };

  window.ACHIEVEMENTS = ACHIEVEMENTS;
  window.AchievementTracker = AchievementTracker;
})(typeof window !== 'undefined' ? window : this);
