// Background script untuk Twitter AI Reply Assistant - Multi API Support

// Configuration management
async function getStoredConfiguration() {
  const result = await chrome.storage.sync.get(['aiConfiguration']);
  return result.aiConfiguration || {
    provider: 'gemini',
    geminiApiKey: '',
    openaiApiKey: '',
    openaiModel: 'gpt-4o-mini',
    openaiFreePlatform: 'deepseek',
    azureApiKey: '',
    azureEndpoint: 'https://okegas.openai.azure.com/',
    azureDeploymentName: 'gpt-4.1-mini',
    azureApiVersion: '2024-02-15-preview'
  };
}

async function setStoredConfiguration(config) {
  await chrome.storage.sync.set({ aiConfiguration: config });
}

// Image processing functions
async function convertImageToBase64(imageUrl) {
  try {
    console.log('🔄 Converting image to base64:', imageUrl);
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
}

// Gemini API functions
async function callGeminiAPI(prompt, apiKey, images = []) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${apiKey}`;
  
  const parts = [{ text: prompt }];
  
  if (images && images.length > 0) {
    console.log('🖼️ Processing images for Gemini:', images.length);
    for (const imageUrl of images) {
      try {
        const base64Data = await convertImageToBase64(imageUrl);
        if (base64Data) {
          parts.push({
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          });
        }
      } catch (error) {
        console.error('❌ Error converting image for Gemini:', error);
      }
    }
  }
  
  const requestBody = {
    contents: [{
      parts: parts
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 200,
      stopSequences: []
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMsg = `HTTP ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.message) {
            errorMsg = errorData.error.message;
          }
        } catch (e) {
          errorMsg += `: ${errorText}`;
        }
        
        if (response.status === 403) {
          throw new Error('Invalid Gemini API key or quota exceeded. Please check your Google AI Studio settings.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else if (response.status >= 500) {
          throw new Error('Google server is experiencing issues. Please try again later.');
        }
        
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text.trim();
      } else if (data.candidates && data.candidates.length > 0 && data.candidates[0].finishReason) {
        const reason = data.candidates[0].finishReason;
        if (reason === 'SAFETY') {
          throw new Error('Content blocked by safety filter. Please try with different content.');
        } else if (reason === 'RECITATION') {
          throw new Error('Content blocked due to recitation. Please try with different content.');
        }
      }
      
      throw new Error('No response generated. Please try again.');
      
    } catch (error) {
      lastError = error;
      console.error(`Gemini API Error (attempt ${attempt}):`, error);
      
      if (error.message.includes('API key') || 
          error.message.includes('quota') ||
          error.message.includes('safety') ||
          error.message.includes('blocked')) {
        throw error;
      }
      
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  throw lastError;
}

// OpenAI API functions
async function callOpenAIAPI(prompt, apiKey, model = 'gpt-4o-mini', images = []) {
  const url = 'https://api.openai.com/v1/chat/completions';
  
  const messages = [
    {
      role: 'user',
      content: images && images.length > 0 ? 
        [
          { type: 'text', text: prompt },
          ...images.map(imageUrl => ({
            type: 'image_url',
            image_url: { url: imageUrl }
          }))
        ] : 
        prompt
    }
  ];

  const requestBody = {
    model: model,
    messages: messages,
    max_tokens: 200,
    temperature: 0.7,
    top_p: 0.95
  };

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMsg = `HTTP ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.message) {
            errorMsg = errorData.error.message;
          }
        } catch (e) {
          errorMsg += `: ${errorText}`;
        }
        
        if (response.status === 401) {
          throw new Error('Invalid OpenAI API key. Please check your API key settings.');
        } else if (response.status === 429) {
          throw new Error('OpenAI rate limit exceeded. Please wait and try again.');
        } else if (response.status === 402) {
          throw new Error('OpenAI quota exceeded. Please check your account billing.');
        } else if (response.status >= 500) {
          throw new Error('OpenAI server is experiencing issues. Please try again later.');
        }
        
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      }
      
      throw new Error('No response generated from OpenAI. Please try again.');
      
    } catch (error) {
      lastError = error;
      console.error(`OpenAI API Error (attempt ${attempt}):`, error);
      
      if (error.message.includes('API key') || 
          error.message.includes('quota') ||
          error.message.includes('billing') ||
          error.message.includes('rate limit')) {
        throw error;
      }
      
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  throw lastError;
}

// Azure OpenAI API functions
async function callAzureOpenAIAPI(prompt, apiKey, endpoint, deploymentName, apiVersion = '2024-02-15-preview', images = []) {
  // Clean endpoint URL (remove trailing slash if present)
  const cleanEndpoint = endpoint.replace(/\/$/, '');
  const url = `${cleanEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
  
  const messages = [
    {
      role: 'user',
      content: images && images.length > 0 ? 
        [
          { type: 'text', text: prompt },
          ...images.map(imageUrl => ({
            type: 'image_url',
            image_url: { url: imageUrl }
          }))
        ] : 
        prompt
    }
  ];

  const requestBody = {
    messages: messages,
    max_tokens: 200,
    temperature: 0.7,
    top_p: 0.95
  };

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMsg = `HTTP ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.message) {
            errorMsg = errorData.error.message;
          }
        } catch (e) {
          errorMsg += `: ${errorText}`;
        }
        
        if (response.status === 401) {
          throw new Error('Invalid Azure OpenAI API key. Please check your API key settings.');
        } else if (response.status === 404) {
          throw new Error('Azure OpenAI deployment not found. Please check your endpoint and deployment name.');
        } else if (response.status === 429) {
          throw new Error('Azure OpenAI rate limit exceeded. Please wait and try again.');
        } else if (response.status === 402) {
          throw new Error('Azure OpenAI quota exceeded. Please check your account billing.');
        } else if (response.status >= 500) {
          throw new Error('Azure OpenAI server is experiencing issues. Please try again later.');
        }
        
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      }
      
      throw new Error('No response generated from Azure OpenAI. Please try again.');
      
    } catch (error) {
      lastError = error;
      console.error(`Azure OpenAI API Error (attempt ${attempt}):`, error);
      
      if (error.message.includes('API key') || 
          error.message.includes('deployment') ||
          error.message.includes('quota') ||
          error.message.includes('billing') ||
          error.message.includes('rate limit')) {
        throw error;
      }
      
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  throw lastError;
}

// OpenAI Free API functions
async function callOpenAIFreeAPI(prompt, platform = 'deepseek') {
  let url, headers, requestBody;
  
  // Configure based on platform
  if (platform === 'deepseek') {
    // DeepSeek free API endpoint (example)
    url = 'https://api.deepseek.com/v1/chat/completions';
    headers = {
      'Content-Type': 'application/json'
    };
    requestBody = {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    };
  } else if (platform === 'groq') {
    // Groq free API endpoint (example)
    url = 'https://api.groq.com/openai/v1/chat/completions';
    headers = {
      'Content-Type': 'application/json'
    };
    requestBody = {
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    };
  } else {
    // Together AI free endpoint (example)
    url = 'https://api.together.xyz/v1/chat/completions';
    headers = {
      'Content-Type': 'application/json'
    };
    requestBody = {
      model: 'meta-llama/Llama-2-7b-chat-hf',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    };
  }

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMsg = `HTTP ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.message) {
            errorMsg = errorData.error.message;
          }
        } catch (e) {
          errorMsg += `: ${errorText}`;
        }
        
        if (response.status === 429) {
          throw new Error('Free API rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status >= 500) {
          throw new Error('Free API server is experiencing issues. Please try again later.');
        }
        
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      }
      
      throw new Error('No valid response generated from free API. Please try again.');
      
    } catch (error) {
      lastError = error;
      console.error(`OpenAI Free API Error (attempt ${attempt}):`, error);
      
      if (error.message.includes('rate limit')) {
        // Wait longer for rate limits
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
        }
      } else if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  throw lastError;
}

// Unified API caller
async function callAIAPI(prompt, config, images = []) {
  if (config.provider === 'openai') {
    return await callOpenAIAPI(prompt, config.openaiApiKey, config.openaiModel, images);
  } else if (config.provider === 'openai-free') {
    // Note: Free APIs don't support images
    if (images && images.length > 0) {
      console.warn('Free API doesn\'t support images. Processing text only.');
    }
    return await callOpenAIFreeAPI(prompt, config.openaiFreePlatform);
  } else if (config.provider === 'azure-openai') {
    return await callAzureOpenAIAPI(
      prompt, 
      config.azureApiKey, 
      config.azureEndpoint, 
      config.azureDeploymentName, 
      config.azureApiVersion, 
      images
    );
  } else {
    return await callGeminiAPI(prompt, config.geminiApiKey, images);
  }
}

// Prompt creation functions
function createReplyPrompt(tweetText, replyType, hasImages = false) {
  const baseContext = hasImages ? 
    "You are analyzing a tweet that contains both text and images. Consider both the text content and visual elements when crafting your response." :
    "You are analyzing a tweet with text content.";
  
  return `${baseContext} Generate a smart, engaging reply to this tweet. The reply should be:
- Contextually relevant and add value to the conversation
- Natural and conversational in tone
- Show understanding of the tweet's content
- Encourage further engagement when appropriate
- Use English language naturally
- Keep it under 100 words
- Be authentic and human-like

Tweet: "${tweetText}"

Your smart reply:`;
}

function createComposePrompt(isReply = false, contextTweet = '') {
  if (isReply && contextTweet) {
    return `Generate a smart, engaging reply to this tweet. The reply should be:
- Contextually relevant and add value to the conversation
- Natural and conversational in tone
- Show understanding of the original tweet's content
- Encourage further engagement when appropriate
- Use English language naturally
- Keep it under 100 words
- Be authentic and human-like

Original Tweet: "${contextTweet}"

Your smart reply:`;
  } else {
    return `Generate engaging, original tweet content. The content should be:
- Interesting and thought-provoking
- Natural and conversational in English
- Relatable to general audience
- Include relevant trending topics when appropriate
- Keep it under 280 characters
- Be authentic and human-like
- Avoid controversial or sensitive topics

Generate creative tweet content:`;
  }
}

// Response generation functions
async function generateResponse(responseType, tweetText, images = []) {
  const config = await getStoredConfiguration();
  
  if (config.provider === 'gemini' && !config.geminiApiKey) {
    throw new Error('Gemini API key not configured. Please set it in the extension popup.');
  }
  
  if (config.provider === 'openai' && !config.openaiApiKey) {
    throw new Error('OpenAI API key not configured. Please set it in the extension popup.');
  }
  
  if (config.provider === 'azure-openai') {
    if (!config.azureApiKey) {
      throw new Error('Azure OpenAI API key not configured. Please set it in the extension popup.');
    }
    if (!config.azureEndpoint) {
      throw new Error('Azure OpenAI endpoint not configured. Please set it in the extension popup.');
    }
    if (!config.azureDeploymentName) {
      throw new Error('Azure OpenAI deployment name not configured. Please set it in the extension popup.');
    }
  }
  
  // OpenAI Free doesn't need API key validation

  let prompt = '';
  
  if (tweetText) {
    prompt = `Tweet: "${tweetText}"\n\n`;
    
    switch (responseType) {
      case 'like':
        prompt += 'Create a reply that shows agreement and support for the tweet above. Use natural and friendly English. Maximum 200 characters.';
        break;
      case 'support':
        prompt += 'Create a reply that provides strong support and motivation for the tweet above. Use positive and encouraging English. Maximum 200 characters.';
        break;
      case 'dislike':
        prompt += 'Create a reply that shows polite and constructive disagreement with the tweet above. Use respectful but firm English. Maximum 200 characters.';
        break;
      case 'suggestion':
        prompt += 'Create a reply that provides constructive suggestions or advice for the tweet above. Use helpful and wise English. Maximum 200 characters.';
        break;
      case 'question':
        prompt += 'Create a reply with relevant and engaging questions related to the tweet above. Use polite English that encourages discussion. Maximum 200 characters.';
        break;
      default:
        prompt += 'Create a smart and relevant reply to the tweet above. Use natural English. Maximum 200 characters.';
    }
  } else {
    switch (responseType) {
      case 'like':
        prompt += 'Create a tweet that shows appreciation or positive things happening. Use cheerful and optimistic English. Maximum 200 characters.';
        break;
      case 'support':
        prompt += 'Create a tweet that provides support or motivation to readers. Use inspiring English. Maximum 200 characters.';
        break;
      case 'dislike':
        prompt += 'Create a tweet that conveys constructive criticism of current issues. Use polite but firm English. Maximum 200 characters.';
        break;
      case 'suggestion':
        prompt += 'Create a tweet that provides useful tips or advice. Use helpful and practical English. Maximum 200 characters.';
        break;
      case 'question':
        prompt += 'Create a tweet with engaging questions that can spark discussion. Use engaging English. Maximum 200 characters.';
        break;
      default:
        prompt += 'Create an interesting and relevant tweet to share. Use natural English. Maximum 200 characters.';
    }
  }

  return await callAIAPI(prompt, config, images);
}

// Message handlers
async function handleGenerateResponse(request, sendResponse) {
  const { responseType, tweetText, tweetImages } = request;
  
  try {
    console.log('🤖 Generating response with type:', responseType);
    
    const response = await generateResponse(responseType, tweetText, tweetImages);
    
    if (response) {
      sendResponse({ 
        success: true, 
        content: response.trim() 
      });
    } else {
      sendResponse({ 
        success: false, 
        error: 'Failed to generate response. Please try again.' 
      });
    }
  } catch (error) {
    console.error('Error generating response:', error);
    sendResponse({ 
      success: false, 
      error: error.message || 'Unknown error occurred'
    });
  }
}

async function handleGetConfiguration(sendResponse) {
  try {
    const config = await getStoredConfiguration();
    sendResponse({ 
      success: true, 
      config: config 
    });
  } catch (error) {
    console.error('Error getting configuration:', error);
    sendResponse({ 
      success: false, 
      error: 'Failed to get configuration' 
    });
  }
}

async function handleSetConfiguration(request, sendResponse) {
  const { config } = request;
  
  try {
    if (!config || typeof config !== 'object') {
      sendResponse({ 
        success: false, 
        error: 'Invalid configuration' 
      });
      return;
    }

    await setStoredConfiguration(config);
    sendResponse({ 
      success: true 
    });
  } catch (error) {
    console.error('Error setting configuration:', error);
    sendResponse({ 
      success: false, 
      error: 'Failed to save configuration' 
    });
  }
}

async function handleTestApiConnection(request, sendResponse) {
  const { provider, apiKey, model } = request;
  
  try {
    if (!provider) {
      sendResponse({ 
        success: false, 
        error: 'Invalid provider' 
      });
      return;
    }
    
    // OpenAI Free doesn't need API key
    if (provider !== 'openai-free' && !apiKey) {
      sendResponse({ 
        success: false, 
        error: 'API key required for this provider' 
      });
      return;
    }

    const testPrompt = 'Hello, this is a test. Please respond with just "OK".';
    
    let response;
    if (provider === 'openai') {
      response = await callOpenAIAPI(testPrompt, apiKey, model);
    } else if (provider === 'azure-openai') {
      if (!model || typeof model !== 'object') {
        sendResponse({ 
          success: false, 
          error: 'Azure OpenAI configuration missing' 
        });
        return;
      }
      response = await callAzureOpenAIAPI(
        testPrompt, 
        apiKey, 
        model.endpoint, 
        model.deploymentName, 
        model.apiVersion
      );
    } else if (provider === 'openai-free') {
      response = await callOpenAIFreeAPI(testPrompt, model);
    } else {
      response = await callGeminiAPI(testPrompt, apiKey);
    }
    
    if (response) {
      let providerName = provider === 'openai' ? 'OpenAI' : 
                        provider === 'openai-free' ? 'OpenAI Free' :
                        provider === 'azure-openai' ? 'Azure OpenAI' : 'Gemini';
      sendResponse({ 
        success: true, 
        message: `${providerName} API is working!` 
      });
    } else {
      sendResponse({ 
        success: false, 
        error: 'API test failed - no response received' 
      });
    }
  } catch (error) {
    console.error('Error testing API connection:', error);
    sendResponse({ 
      success: false, 
      error: error.message || 'Unknown error occurred'
    });
  }
}

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateResponse') {
    handleGenerateResponse(request, sendResponse);
    return true;
  } else if (request.action === 'getConfiguration') {
    handleGetConfiguration(sendResponse);
    return true;
  } else if (request.action === 'setConfiguration') {
    handleSetConfiguration(request, sendResponse);
    return true;
  } else if (request.action === 'testApiConnection') {
    handleTestApiConnection(request, sendResponse);
    return true;
  }
  
  // Legacy support for old API
  else if (request.action === 'getApiKey') {
    handleGetConfiguration(sendResponse);
    return true;
  } else if (request.action === 'setApiKey') {
    // Convert old format to new format
    handleSetConfiguration({
      config: {
        provider: 'gemini',
        geminiApiKey: request.apiKey,
        openaiApiKey: '',
        openaiModel: 'gpt-4o-mini',
        openaiFreePlatform: 'deepseek'
      }
    }, sendResponse);
    return true;
  } else if (request.action === 'testApiKey') {
    handleTestApiConnection({
      provider: 'gemini',
      apiKey: request.apiKey,
      model: null
    }, sendResponse);
    return true;
  }
});

// Event listener when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Twitter AI Reply Assistant with Multi-API Support installed!');
}); 