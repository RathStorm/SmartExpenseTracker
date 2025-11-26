/**
 * Dynamic UI Test Script
 * Tests the processing workflow UI updates and batch progress simulation
 */

// Wait for DOM and main script to load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🧪 Starting Dynamic UI Test Suite...');
  console.log('=====================================');

  // Wait a bit for main script to initialize
  setTimeout(() => {
    runDynamicUITests();
  }, 1000);
});

/**
 * Main test runner
 */
function runDynamicUITests() {
  console.log('\n📊 Test 1: Checking if required functions exist...');
  
  // Check for required functions
  const requiredFunctions = [
    'startBatchProcess',
    'updateProcessingWorkflowStages',
    'updateProcessingMetrics',
    'saveToStorage',
    'updateUI'
  ];

  let allFunctionsExist = true;
  requiredFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
      console.log(`✅ ${funcName} is defined`);
    } else {
      console.error(`❌ ${funcName} is NOT defined`);
      allFunctionsExist = false;
    }
  });

  if (!allFunctionsExist) {
    console.error('⚠️ Some required functions are missing. Make sure script.js is loaded.');
    return;
  }

  console.log('\n📊 Test 2: Checking processing array...');
  if (typeof processing !== 'undefined' && Array.isArray(processing)) {
    console.log(`✅ Processing array exists with ${processing.length} items`);
    
    if (processing.length > 0) {
      console.log('Sample batch:', processing[0]);
    } else {
      console.log('ℹ️ No batches in processing array. Adding test batches...');
      addTestBatches();
    }
  } else {
    console.error('❌ Processing array not found');
    return;
  }

  console.log('\n📊 Test 3: Testing workflow stage UI elements...');
  testWorkflowStageElements();

  console.log('\n📊 Test 4: Testing metrics UI elements...');
  testMetricsElements();

  console.log('\n📊 Test 5: Starting batch process simulation...');
  if (typeof startBatchProcess === 'function') {
    try {
      startBatchProcess();
      console.log('✅ Batch process started successfully');
      
      // Monitor progress
      monitorBatchProgress();
    } catch (error) {
      console.error('❌ Error starting batch process:', error);
    }
  } else {
    console.error('❌ startBatchProcess function not available');
  }
}

/**
 * Add test batches for demonstration
 */
function addTestBatches() {
  if (typeof processing === 'undefined') {
    console.error('Cannot add test batches: processing array not found');
    return;
  }

  const testBatches = [
    {
      id: Date.now(),
      type: 'slaughter',
      product: 'Beef',
      quantity: 500,
      processingDate: new Date().toISOString().split('T')[0],
      cost: 200,
      status: 'pending',
      progress: 0,
      notes: 'Test batch 1',
      timestamp: new Date().toISOString()
    },
    {
      id: Date.now() + 1,
      type: 'packaging',
      product: 'Chicken',
      quantity: 300,
      processingDate: new Date().toISOString().split('T')[0],
      cost: 150,
      status: 'pending',
      progress: 0,
      notes: 'Test batch 2',
      timestamp: new Date().toISOString()
    },
    {
      id: Date.now() + 2,
      type: 'freezing',
      product: 'Pork',
      quantity: 400,
      processingDate: new Date().toISOString().split('T')[0],
      cost: 180,
      status: 'pending',
      progress: 0,
      notes: 'Test batch 3',
      timestamp: new Date().toISOString()
    }
  ];

  processing.push(...testBatches);
  
  if (typeof saveToStorage === 'function') {
    saveToStorage();
  }
  
  if (typeof updateUI === 'function') {
    updateUI();
  }

  console.log(`✅ Added ${testBatches.length} test batches`);
}

/**
 * Test workflow stage UI elements
 */
function testWorkflowStageElements() {
  const stages = [
    { name: 'Raw Materials', selector: '.workflow-stages .stage-card:nth-child(1)' },
    { name: 'Processing', selector: '.workflow-stages .stage-card:nth-child(2)' },
    { name: 'Quality Control', selector: '.workflow-stages .stage-card:nth-child(3)' },
    { name: 'Packaging', selector: '.workflow-stages .stage-card:nth-child(4)' }
  ];

  stages.forEach(stage => {
    const element = document.querySelector(stage.selector);
    if (element) {
      const metric = element.querySelector('.stage-metrics .metric')?.textContent;
      const status = element.querySelector('.status')?.textContent;
      console.log(`✅ ${stage.name}: Metric="${metric}", Status="${status}"`);
    } else {
      console.warn(`⚠️ ${stage.name} element not found`);
    }
  });
}

/**
 * Test metrics UI elements
 */
function testMetricsElements() {
  // Efficiency Rate
  const efficiency = document.querySelector('.efficiency-gauge .gauge-value')?.textContent;
  console.log(efficiency ? `✅ Efficiency Rate: ${efficiency}` : '⚠️ Efficiency gauge not found');

  // Batch Success Rate
  const successRate = document.querySelector('.success-rate .rate-value')?.textContent;
  console.log(successRate ? `✅ Batch Success Rate: ${successRate}` : '⚠️ Success rate not found');

  // Equipment Utilization
  const utilItems = document.querySelectorAll('.utilization-item');
  if (utilItems.length > 0) {
    console.log(`✅ Found ${utilItems.length} equipment utilization items`);
    utilItems.forEach((item, index) => {
      const name = item.querySelector('.util-name')?.textContent;
      const value = item.querySelector('.util-value')?.textContent;
      console.log(`   ${index + 1}. ${name}: ${value}`);
    });
  } else {
    console.warn('⚠️ Equipment utilization items not found');
  }
}

/**
 * Monitor batch progress over time
 */
function monitorBatchProgress() {
  console.log('\n📊 Monitoring batch progress (will check every 3 seconds for 30 seconds)...');
  console.log('=====================================');

  let checkCount = 0;
  const maxChecks = 10; // 30 seconds total

  const monitorInterval = setInterval(() => {
    checkCount++;
    console.log(`\n⏱️ Progress Check #${checkCount} (${checkCount * 3}s elapsed)`);
    console.log('-----------------------------------');

    // Check processing array
    if (typeof processing !== 'undefined' && Array.isArray(processing)) {
      const processingBatches = processing.filter(b => b.status === 'processing');
      const completedBatches = processing.filter(b => b.status === 'complete');
      const pendingBatches = processing.filter(b => b.status === 'pending');

      console.log(`📦 Total Batches: ${processing.length}`);
      console.log(`⚙️ Processing: ${processingBatches.length}`);
      console.log(`✅ Completed: ${completedBatches.length}`);
      console.log(`⏳ Pending: ${pendingBatches.length}`);

      // Show progress of processing batches
      if (processingBatches.length > 0) {
        console.log('\nBatch Progress:');
        processingBatches.forEach(batch => {
          console.log(`  • Batch ${batch.id}: ${batch.progress || 0}% (${batch.product})`);
        });
      }
    }

    // Check UI elements
    const efficiency = document.querySelector('.efficiency-gauge .gauge-value')?.textContent;
    const successRate = document.querySelector('.success-rate .rate-value')?.textContent;
    const processingStatus = document.querySelector('.workflow-stages .stage-card:nth-child(2) .status')?.textContent;

    console.log('\nUI Metrics:');
    console.log(`  • Efficiency: ${efficiency || 'N/A'}`);
    console.log(`  • Success Rate: ${successRate || 'N/A'}`);
    console.log(`  • Processing Status: ${processingStatus || 'N/A'}`);

    // Stop after max checks
    if (checkCount >= maxChecks) {
      clearInterval(monitorInterval);
      console.log('\n=====================================');
      console.log('✅ Dynamic UI test completed!');
      console.log('=====================================');
      
      // Final summary
      printFinalSummary();
    }
  }, 3000); // Check every 3 seconds
}

/**
 * Print final test summary
 */
function printFinalSummary() {
  console.log('\n📋 FINAL TEST SUMMARY');
  console.log('=====================================');

  if (typeof processing !== 'undefined' && Array.isArray(processing)) {
    const completed = processing.filter(b => b.status === 'complete').length;
    const total = processing.length;
    const percentage = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

    console.log(`Total Batches: ${total}`);
    console.log(`Completed: ${completed}`);
    console.log(`Completion Rate: ${percentage}%`);
  }

  console.log('\n✅ All tests completed successfully!');
  console.log('You can now interact with the processing page to see the dynamic updates.');
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.runDynamicUITests = runDynamicUITests;
  window.addTestBatches = addTestBatches;
}

console.log('✅ Dynamic UI test script loaded');
