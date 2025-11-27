// Dalam handleCreateBatch, tambah progress tracking:
const handleCreateBatch = async () => {
  setIsLoading(true);
  
  // Start progress tracking
  if (onBatchStart) {
    onBatchStart({
      progress: 0,
      currentStep: 'Initializing batch creation...',
      status: 'processing'
    });
  }

  // Simulate progress
  const updateProgress = (progress, step) => {
    if (onBatchStart) {
      onBatchStart({
        progress,
        currentStep: step,
        status: 'processing'
      });
    }
  };

  try {
    updateProgress(20, 'Generating AI prompts...');
    
    const response = await fetch('https://n8n.fallonava.my.id/webhook/midjourney-batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings)
    });
    
    updateProgress(60, 'Processing with MidJourney...');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    updateProgress(100, 'Batch completed successfully!');
    
    if (result.status === 'success') {
      alert(`🎉 ${result.message}\n📝 ${result.prompts_generated} prompts generated!`);
      
      // Complete progress
      if (onBatchStart) {
        setTimeout(() => {
          onBatchStart({
            progress: 100,
            currentStep: 'Batch ready for processing!',
            status: 'completed'
          });
        }, 1000);
      }
    } else {
      throw new Error(result.message);
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
    alert('💥 Failed: ' + error.message);
    
    if (onBatchStart) {
      onBatchStart({
        progress: 0,
        currentStep: 'Batch creation failed',
        status: 'error'
      });
    }
  } finally {
    setIsLoading(false);
  }
};