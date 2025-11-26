/**
 * Enhanced Batch Process Starter
 * This file provides an alternative implementation for starting batch processes
 * with improved error handling and performance optimizations.
 */

// Import from main script if needed
// Note: This assumes the main script.js has already loaded

/**
 * Start batch processing with enhanced features
 * This is an alternative implementation that can be used instead of the one in script.js
 */
function startBatchProcessEnhanced() {
  // Check if processing array exists
  if (typeof processing === 'undefined' || !Array.isArray(processing)) {
    console.error('Processing array not found. Make sure script.js is loaded first.');
    return;
  }

  if (processing.length === 0) {
    showNotification('No active processing batches to start', 'error');
    return;
  }

  // Clear any existing intervals
  if (typeof clearAllBatchIntervals === 'function') {
    clearAllBatchIntervals();
  }

  // Initialize batches with pending or undefined status
  let batchesStarted = 0;
  processing.forEach(batch => {
    if (!batch.status || batch.status === 'pending') {
      batch.status = 'processing';
      batch.startTime = new Date().toISOString();
      batch.progress = 0;
      batchesStarted++;
    }
  });

  if (batchesStarted === 0) {
    showNotification('No pending batches to start', 'info');
    return;
  }

  // Save to storage
  if (typeof saveToStorage === 'function') {
    saveToStorage();
  }

  // Update UI
  if (typeof updateUI === 'function') {
    updateUI();
  }

  showNotification(`Started processing ${batchesStarted} batch${batchesStarted > 1 ? 'es' : ''}`, 'success');

  // Start progress simulation for each batch
  processing.forEach(batch => {
    if (batch.status === 'processing') {
      simulateBatchProgressEnhanced(batch);
    }
  });
}

/**
 * Enhanced batch progress simulation
 * @param {Object} batch - The batch object to simulate progress for
 */
function simulateBatchProgressEnhanced(batch) {
  if (!batch || !batch.id) {
    console.error('Invalid batch object');
    return;
  }

  // Check if interval already exists
  if (typeof batchIntervalIds !== 'undefined' && batchIntervalIds.has(batch.id)) {
    console.warn(`Batch ${batch.id} already has an active interval`);
    return;
  }

  const intervalId = setInterval(() => {
    try {
      // Safety check
      if (!batch) {
        clearInterval(intervalId);
        if (typeof batchIntervalIds !== 'undefined') {
          batchIntervalIds.delete(batch.id);
        }
        return;
      }

      // Check if complete
      if (batch.progress >= 100) {
        batch.status = 'complete';
        batch.progress = 100;
        batch.completedTime = new Date().toISOString();

        // Save and update
        if (typeof saveToStorage === 'function') saveToStorage();
        if (typeof updateUI === 'function') updateUI();

        // Show notification (throttled)
        if (typeof showNotification === 'function') {
          showNotification(`Batch ${batch.batchId || batch.id} completed`, 'success');
        }

        // Clear interval
        clearInterval(intervalId);
        if (typeof batchIntervalIds !== 'undefined') {
          batchIntervalIds.delete(batch.id);
        }
      } else {
        // Increment progress with randomization
        const increment = Math.floor(Math.random() * 8) + 3; // 3 to 10
        batch.progress += increment;
        if (batch.progress > 100) batch.progress = 100;

        // Save and update
        if (typeof saveToStorage === 'function') saveToStorage();
        if (typeof updateUI === 'function') updateUI();
      }
    } catch (error) {
      console.error('Error in batch progress simulation:', error);
      clearInterval(intervalId);
      if (typeof batchIntervalIds !== 'undefined') {
        batchIntervalIds.delete(batch.id);
      }
    }
  }, 1500); // 1.5 second intervals

  // Store interval ID
  if (typeof batchIntervalIds !== 'undefined') {
    batchIntervalIds.set(batch.id, intervalId);
  }
}

/**
 * Stop all batch processes
 */
function stopAllBatchProcesses() {
  if (typeof clearAllBatchIntervals === 'function') {
    clearAllBatchIntervals();
  }

  if (typeof processing !== 'undefined' && Array.isArray(processing)) {
    processing.forEach(batch => {
      if (batch.status === 'processing') {
        batch.status = 'paused';
      }
    });

    if (typeof saveToStorage === 'function') saveToStorage();
    if (typeof updateUI === 'function') updateUI();
    if (typeof showNotification === 'function') {
      showNotification('All batch processes stopped', 'info');
    }
  }
}

/**
 * Reset a specific batch
 * @param {number} batchId - The ID of the batch to reset
 */
function resetBatch(batchId) {
  if (typeof processing === 'undefined' || !Array.isArray(processing)) {
    console.error('Processing array not found');
    return;
  }

  const batch = processing.find(b => b.id === batchId);
  if (batch) {
    batch.status = 'pending';
    batch.progress = 0;
    delete batch.startTime;
    delete batch.completedTime;

    if (typeof saveToStorage === 'function') saveToStorage();
    if (typeof updateUI === 'function') updateUI();
    if (typeof showNotification === 'function') {
      showNotification(`Batch ${batchId} reset`, 'success');
    }
  }
}

// Export functions if module system is available
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    startBatchProcessEnhanced,
    stopAllBatchProcesses,
    resetBatch,
    simulateBatchProgressEnhanced
  };
}

// Make functions globally available
if (typeof window !== 'undefined') {
  window.startBatchProcessEnhanced = startBatchProcessEnhanced;
  window.stopAllBatchProcesses = stopAllBatchProcesses;
  window.resetBatch = resetBatch;
}

console.log('Enhanced batch process functions loaded');
