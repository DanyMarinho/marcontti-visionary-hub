export const triggerN8nWebhook = async (webhookUrl: string, data: any) => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`n8n webhook failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error triggering n8n webhook:', error);
    throw error;
  }
};
