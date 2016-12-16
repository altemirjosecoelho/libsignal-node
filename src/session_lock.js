 /*
  * jobQueue manages multiple queues indexed by device to serialize
  * session io ops on the database.
  */
'use strict';

const SessionLock = {};

var jobQueue = {};

SessionLock.queueJobForNumber = function queueJobForNumber(number, runJob) {
     var runPrevious = jobQueue[number] || Promise.resolve();
     var runCurrent = jobQueue[number] = runPrevious.then(runJob, runJob);
     runCurrent.then(function() {
         if (jobQueue[number] === runCurrent) {
             delete jobQueue[number];
         }
     });
     return runCurrent;
};

module.exports = SessionLock;