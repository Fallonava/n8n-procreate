const handleCreateBatch = async () => {
  setIsLoading(true);
  try {
    console.log('🔄 Sending to n8n...', settings);
    
    const response = await fetch('https://n8n.fallonava.my.id/webhook/midjourney-batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ n8n Response:', result);
    
    if (result.status === 'success') {
      alert(`🎉 ${result.message}\n📝 ${result.prompts_generated} prompts generated!\n🎯 Niche: ${result.niche}`);
    } else {
      alert(`❌ Workflow error: ${result.message}`);
    }
    
  } catch (error) {
    console.error('💥 Network error:', error);
    alert('💥 Failed to connect to n8n: ' + error.message);
  } finally {
    setIsLoading(false);
  }
};