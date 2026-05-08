import { FocusSession, Insight, InsightType, WeeklyInsight } from '../../models';
import { generateId } from '../../utils/generateId';
import { getStartOfWeek } from '../../utils/formatTime';

function makeInsight(
  type: InsightType,
  message: string,
  priority: number,
  evidence?: string,
  actionLabel?: string,
  actionTarget?: string
): Insight {
  return {
    id: generateId(),
    type,
    message,
    evidence,
    createdAt: new Date().toISOString(),
    priority,
    actionLabel,
    actionTarget,
  };
}

export const InsightService = {
  generatePostSessionInsight(session: FocusSession): Insight {
    // Rule: rerouted at least once
    if (session.rerouteCount > 0) {
      return makeInsight(
        'rerouted',
        `You rerouted ${session.rerouteCount} time${session.rerouteCount !== 1 ? 's' : ''}. That matters.`,
        10
      );
    }

    // Rule: too many unlocks
    if (session.unlockCount > 2) {
      return makeInsight(
        'too_many_unlocks',
        'This session had several unlocks. Try a shorter session next time.',
        8
      );
    }

    // Rule: task unclear was the main reason
    if (session.distractionReasons.includes('Task unclear')) {
      return makeInsight(
        'task_unclear',
        'Try making the next action smaller before starting.',
        9,
        'Task unclear was your main drift reason.'
      );
    }

    // Rule: short session completed successfully
    if (session.completedFocusMinutes > 0 && session.completedFocusMinutes <= 15) {
      return makeInsight(
        'short_session_good',
        'Short sessions may be a good starting point. You finished this one.',
        7
      );
    }

    // Default for completed session
    if (session.rerouteCount === 0 && session.driftCount === 0) {
      return makeInsight(
        'general',
        'A clean session. Keep that going.',
        5
      );
    }

    return makeInsight(
      'general',
      'You drifted, but you got back. That counts.',
      5
    );
  },

  generateWeeklyInsights(sessions: FocusSession[]): WeeklyInsight {
    const weekStart = getStartOfWeek();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekSessions = sessions.filter(s => {
      const d = new Date(s.startedAt);
      return d >= weekStart && d <= weekEnd && s.status === 'completed';
    });

    const totalReroutes = weekSessions.reduce((sum, s) => sum + s.rerouteCount, 0);

    const distractionCounts: Record<string, number> = {};
    weekSessions.forEach(s => {
      s.distractionReasons.forEach(r => {
        distractionCounts[r] = (distractionCounts[r] ?? 0) + 1;
      });
    });
    const biggestDistraction = Object.entries(distractionCounts).sort(([, a], [, b]) => b - a)[0]?.[0];

    const lengthGroups: Record<number, number> = {};
    weekSessions.forEach(s => {
      const len = s.durationMinutes;
      lengthGroups[len] = (lengthGroups[len] ?? 0) + 1;
    });
    const bestSessionLength = Object.entries(lengthGroups).sort(([, a], [, b]) => b - a)[0]?.[0];

    let mainPattern = 'You completed focus sessions this week.';
    if (weekSessions.length === 0) {
      mainPattern = 'No completed sessions this week. Start small next week.';
    } else if (totalReroutes > 5) {
      mainPattern = `You rerouted ${totalReroutes} times. Each reroute is a return, not a failure.`;
    } else if (biggestDistraction === 'Task unclear') {
      mainPattern = 'Task clarity was your main challenge this week.';
    }

    let experiment = 'Try starting with a session under 20 minutes.';
    if (bestSessionLength && Number(bestSessionLength) <= 25) {
      experiment = `Your best sessions were around ${bestSessionLength} minutes. Try that again.`;
    } else if (biggestDistraction) {
      experiment = `Try writing a clearer Reroute Plan before sessions where ${biggestDistraction} tends to pull you away.`;
    }

    return {
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      sessionsCompleted: weekSessions.length,
      timesRerouted: totalReroutes,
      biggestDistraction,
      bestSessionLength: bestSessionLength ? Number(bestSessionLength) : undefined,
      mainPattern,
      suggestedExperiment: experiment,
    };
  },

  detectRepeatedDistractions(sessions: FocusSession[]): string | null {
    const counts: Record<string, number> = {};
    sessions.slice(0, 20).forEach(s => {
      s.selectedDistractions.forEach(d => {
        counts[d] = (counts[d] ?? 0) + 1;
      });
    });
    const top = Object.entries(counts).sort(([, a], [, b]) => b - a)[0];
    if (top && top[1] >= 3) return top[0];
    return null;
  },

  detectBestSessionLength(sessions: FocusSession[]): number | null {
    const completed = sessions.filter(s => s.status === 'completed');
    if (completed.length < 3) return null;
    const counts: Record<number, number> = {};
    completed.forEach(s => {
      counts[s.durationMinutes] = (counts[s.durationMinutes] ?? 0) + 1;
    });
    const top = Object.entries(counts).sort(([, a], [, b]) => b - a)[0];
    return top ? Number(top[0]) : null;
  },

  detectCommonDriftReason(sessions: FocusSession[]): string | null {
    const counts: Record<string, number> = {};
    sessions.forEach(s => {
      s.distractionReasons.forEach(r => {
        counts[r] = (counts[r] ?? 0) + 1;
      });
    });
    const top = Object.entries(counts).sort(([, a], [, b]) => b - a)[0];
    return top ? top[0] : null;
  },

  suggestNextExperiment(sessions: FocusSession[]): string {
    const bestLength = InsightService.detectBestSessionLength(sessions);
    const commonDrift = InsightService.detectCommonDriftReason(sessions);
    const repeatedDistraction = InsightService.detectRepeatedDistractions(sessions);

    if (commonDrift === 'Task unclear') {
      return 'Write a one-sentence task description before your next session.';
    }
    if (bestLength && bestLength <= 25) {
      return `Try three ${bestLength}-minute sessions in a row with a short break between each.`;
    }
    if (repeatedDistraction) {
      return `Protect ${repeatedDistraction} by default in your next session.`;
    }
    return 'Try a 20-minute session and note what pulled your attention.';
  },
};
