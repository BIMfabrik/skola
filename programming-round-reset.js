/* Reset programming workspace between adaptive rounds, including when the chooser repeats the same stage. */
(() => {
  const baseCompleteStage = completeStage;
  completeStage = function completeStageWithProgramReset() {
    if (state.session && ACTIVITIES[state.session.id]?.type === 'program') {
      state.session.program = null;
      state.session.programStage = null;
      state.session.programSelected = -1;
      state.session.programRunning = false;
    }
    return baseCompleteStage();
  };
})();
