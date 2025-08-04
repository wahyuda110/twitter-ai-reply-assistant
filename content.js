// Content script untuk Twitter AI Reply Assistant
let currentUrl = window.location.href;
let isProcessing = false;

// Cleanup function to remove stale AI buttons
function cleanupAIButtons() {
  console.log('🧹 Cleaning up stale AI buttons...');
  
  // Remove compose buttons if not on compose page
  if (!isComposePage()) {
    const composeButtons = document.querySelectorAll('.ai-response-buttons');
    composeButtons.forEach(button => {
      button.remove();
      console.log('🗑️ Removed compose AI buttons');
    });
  }
  
  // Remove floating toolbar if not needed
  const floatingToolbar = document.getElementById('ai-floating-toolbar');
  if (floatingToolbar && !isComposePage()) {
    floatingToolbar.remove();
    console.log('🗑️ Removed floating toolbar');
  }
  
  // Remove tweet AI buttons if not on feed page
  if (isComposePage()) {
    const tweetButtons = document.querySelectorAll('.blitz-ai-reply-btn');
    tweetButtons.forEach(button => {
      button.remove();
      console.log('🗑️ Removed tweet AI buttons');
    });
  }
}

// Enhanced navigation detection
function handleNavigation() {
  const newUrl = window.location.href;
  if (newUrl !== currentUrl) {
    console.log(`🔄 Navigation detected: ${currentUrl} -> ${newUrl}`);
    currentUrl = newUrl;
    
    // Clean up stale buttons
    cleanupAIButtons();
    
    // Process new page after cleanup
    setTimeout(() => {
      console.log('📍 Processing new page after navigation...');
      processPage();
    }, 1000);
  }
}

// Listen for navigation events
window.addEventListener('popstate', handleNavigation);
window.addEventListener('pushstate', handleNavigation);
window.addEventListener('replacestate', handleNavigation);

// Override history methods to catch programmatic navigation
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function(...args) {
  originalPushState.apply(history, args);
  handleNavigation();
};

history.replaceState = function(...args) {
  originalReplaceState.apply(history, args);
  handleNavigation();
};

// Debug logging
console.log('🚀 Twitter AI Reply Assistant - BlitzX Style loaded!');
console.log('📍 Current URL:', window.location.href);
console.log('📍 Current hostname:', window.location.hostname);

// Check page type
const isComposePageType = window.location.href.includes('/compose/post') || window.location.href.includes('/compose/tweet');
const isHomeFeed = window.location.href.includes('/home') || window.location.pathname === '/';
console.log('📄 Page type:', isComposePageType ? 'Compose' : isHomeFeed ? 'Home Feed' : 'Other');

// Check if extension context is valid
function isExtensionContextValid() {
  try {
    return chrome.runtime && chrome.runtime.id;
  } catch (error) {
    return false;
  }
}

// Show user-friendly error message
function showErrorNotification(message) {
  // Create a more user-friendly notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff4757;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10001;
    font-size: 14px;
    max-width: 300px;
    word-wrap: break-word;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

// Check if current page is a compose page
function isComposePage() {
  const currentUrl = window.location.href;
  const urlChecks = {
    composePost: currentUrl.includes('/compose/post'),
    composeTweet: currentUrl.includes('/compose/tweet'),
    reply: currentUrl.includes('reply'),
    generalCompose: currentUrl.includes('compose')
  };
  
  const elementChecks = {
    tweetTextarea: !!document.querySelector('[data-testid="tweetTextarea_0"]'),
    contentEditable: !!document.querySelector('[contenteditable="true"]'),
    tweetElement: !!document.querySelector('[data-testid="tweet"]')
  };
  
  const isCompose = urlChecks.composePost || 
                   urlChecks.composeTweet ||
                   urlChecks.reply ||
                   elementChecks.tweetTextarea ||
                   (elementChecks.contentEditable && 
                    (elementChecks.tweetElement || urlChecks.generalCompose));
  
  console.log('🔍 Page detection:', {
    url: currentUrl,
    urlChecks,
    elementChecks,
    isCompose
  });
  
  return isCompose;
}

// Fungsi untuk membuat AI response buttons - Grid Layout
function createAIResponseButtons() {
  const container = document.createElement('div');
  container.className = 'ai-response-buttons';
  container.innerHTML = `
    <button class="ai-option-btn like-btn" data-type="like" title="R3 format - casual, lowercase, supportive Web3/crypto style">
      <span class="emoji">👍</span>
    </button>
    <button class="ai-option-btn support-btn" data-type="support" title="Rewrite for busy scrollers - make it skimmable">
      <span class="emoji">💪</span>
    </button>
    <button class="ai-option-btn dislike-btn" data-type="dislike" title="Create 1 headline with curiosity and urgency">
      <span class="emoji">👎</span>
    </button>
    <button class="ai-option-btn suggestion-btn" data-type="suggestion" title="Break into bold, punchy list - structure sells">
      <span class="emoji">💡</span>
    </button>
    <button class="ai-option-btn question-btn" data-type="question" title="Highlight strongest line, cut weakest - sniper editing">
      <span class="emoji">❓</span>
    </button>
    <button class="ai-option-btn tone-btn" data-type="tone" title="R3 format - casual, lowercase, supportive Web3/crypto style">
      <span class="emoji">🗣️</span>
    </button>
    <button class="ai-option-btn series-btn" data-type="series" title="Turn into teaching content - strategy over spam">
      <span class="emoji">📝</span>
    </button>
  `;
  return container;
}

// Fungsi untuk membuat AI reply button ala BlitzX (untuk feed)
function createAIReplyButton() {
  const button = document.createElement('button');
  button.className = 'blitz-ai-reply-btn';
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1-.9 2-2 2-3.5V14.5c0-.5-.5-1-1-1s-1 .5-1 1V24c-4.5-.5-8-4.5-8-9V8.3L12 4.7 21 8.3V17c0 4.5-3.5 8.5-8 9v-8.5c0-.5-.5-1-1-1s-1 .5-1 1V26c5.16-1 9-5.45 9-11V7l-10-5z"/>
    </svg>
    <span>Reply</span>
  `;
  button.title = 'Generate AI reply with Gemini';
  return button;
}

// Fungsi untuk mengekstrak teks tweet
function extractTweetText(tweetElement) {
  // Mencari berbagai selector yang mungkin untuk teks tweet
  const textSelectors = [
    '[data-testid="tweetText"]',
    '[lang]',
    '.tweet-text',
    '.r-37j5jr',
    '.css-1dbjc4n .r-37j5jr'
  ];
  
  for (const selector of textSelectors) {
    const textElement = tweetElement.querySelector(selector);
    if (textElement && textElement.textContent.trim()) {
      return textElement.textContent.trim();
    }
  }
  
  return '';
}

// Fungsi untuk mengekstrak gambar dari tweet
function extractTweetImages(tweetElement) {
  const images = [];
  const imageSelectors = [
    '[data-testid="tweetPhoto"] img',
    '.css-9pa8cd img',
    '[role="img"]',
    'img[src*="pbs.twimg.com"]'
  ];
  
  for (const selector of imageSelectors) {
    const imageElements = tweetElement.querySelectorAll(selector);
    imageElements.forEach(img => {
      if (img.src && img.src.includes('pbs.twimg.com')) {
        // Get higher quality image URL
        const highQualityUrl = img.src.replace(/&name=\w+/, '&name=large');
        images.push(highQualityUrl);
      }
    });
  }
  
  return [...new Set(images)]; // Remove duplicates
}

// Fungsi untuk convert image URL ke base64
async function imageUrlToBase64(url) {
  try {
    const response = await fetch(url);
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

// Fungsi untuk menemukan area actions di tweet (like, retweet, reply, etc)
function findTweetActionsArea(tweetElement) {
  console.log('🔍 Looking for actions area in tweet...');
  
  // Mencari berbagai selector untuk area actions
  const actionSelectors = [
    '[role="group"]', // Main actions group
    '[data-testid="reply"]', // Reply button parent
    '[data-testid="retweet"]', // Retweet button parent
    '.css-1dbjc4n[role="group"]', // Generic group
    '.css-175oi2r[role="group"]', // Alternative group class
    '.r-1777fci[role="group"]', // Another Twitter group class
    'div[role="group"]', // Simple div group
    '.r-18u37iz[role="group"]', // X.com specific class
    '.r-1h0z5md[role="group"]', // Another X.com class
    '.css-1dbjc4n.r-18u37iz', // Combined classes
  ];
  
  for (const selector of actionSelectors) {
    const actionsAreas = tweetElement.querySelectorAll(selector);
    console.log(`  📋 Found ${actionsAreas.length} elements with selector: ${selector}`);
    
    for (const actionsArea of actionsAreas) {
      // Pastikan ini adalah area actions yang benar (biasanya berisi reply, retweet, like)
      const hasReply = actionsArea.querySelector('[data-testid="reply"]');
      const hasRetweet = actionsArea.querySelector('[data-testid="retweet"]');
      const hasLike = actionsArea.querySelector('[data-testid="like"]');
      
      console.log(`    ✓ Reply: ${!!hasReply}, Retweet: ${!!hasRetweet}, Like: ${!!hasLike}`);
      
      if (hasReply || hasRetweet || hasLike) {
        console.log('✅ Found valid actions area!');
        return actionsArea;
      }
    }
  }
  
  // Fallback: cari any element yang berisi reply/retweet/like button
  console.log('🔄 Trying fallback method...');
  const replyBtn = tweetElement.querySelector('[data-testid="reply"]');
  const retweetBtn = tweetElement.querySelector('[data-testid="retweet"]');
  const likeBtn = tweetElement.querySelector('[data-testid="like"]');
  
  if (replyBtn || retweetBtn || likeBtn) {
    const foundBtn = replyBtn || retweetBtn || likeBtn;
    const parentGroup = foundBtn.closest('[role="group"]') || foundBtn.parentElement;
    if (parentGroup) {
      console.log('✅ Found actions area via fallback method!');
      return parentGroup;
    }
  }
  
  console.log('❌ No valid actions area found even with fallback');
  return null;
}

// Fungsi untuk menambahkan AI reply button ke tweet (BlitzX style)
function addAIButtonToTweet(tweetElement) {
  console.log('🔧 Adding AI button to tweet...');
  
  // Cek apakah sudah ada AI button
  if (tweetElement.querySelector('.blitz-ai-reply-btn')) {
    console.log('⚠️ AI button already exists, skipping');
    return;
  }
  
  const actionsArea = findTweetActionsArea(tweetElement);
  if (!actionsArea) {
    console.log('❌ No actions area found, cannot add button');
    return;
  }
  
  console.log('✅ Actions area found, creating AI button...');
  
  // Buat AI reply button
  const aiButton = createAIReplyButton();
  
  // Event listener untuk button
  aiButton.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const originalContent = aiButton.innerHTML;
    
    if (aiButton.disabled) return;
    
    // Tampilkan loading state
    aiButton.disabled = true;
    aiButton.classList.add('loading');
    aiButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z">
          <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
        </path>
      </svg>
      <span>Generating...</span>
    `;
    
    try {
      await handleAIResponse('smart_reply', tweetElement);
    } finally {
      // Reset button state
      aiButton.disabled = false;
      aiButton.classList.remove('loading');
      aiButton.innerHTML = originalContent;
    }
  });
  
  // Tambahkan button ke actions area dengan styling yang tepat
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'margin-left: 8px; display: flex; align-items: center;';
  wrapper.appendChild(aiButton);
  actionsArea.appendChild(wrapper);
  
  console.log('🎉 AI button successfully added to tweet!');
}

// Fungsi untuk menemukan compose textarea
function findComposeTextarea() {
  console.log('🔍 Looking for compose textarea...');
  
  const textareaSelectors = [
    '[data-testid="tweetTextarea_0"]', // Main compose textarea
    '[data-testid="tweetTextarea"]', // Alternative compose textarea
    '[placeholder*="What is happening"]', // English placeholder
    '[placeholder*="What\'s happening"]', // Alternative English
    '[placeholder*="Share your thoughts"]', // Compose post placeholder
    '[placeholder*="What\'s on your mind"]', // Alternative compose placeholder
    '[placeholder*="Apa yang sedang terjadi"]', // Indonesian placeholder
    '.DraftEditor-editorContainer', // Draft editor
    '.public-DraftEditor-content', // Draft editor content
    '[contenteditable="true"]', // Any contenteditable
    'div[role="textbox"]', // Textbox role
    '.notranslate', // X.com compose area class
    '.css-1dbjc4n[role="textbox"]', // Styled textbox
    '[data-testid*="tweet"][contenteditable="true"]', // Tweet specific contenteditable
    '[aria-label*="Post text"]', // Post text area
    '[aria-label*="Tweet text"]', // Tweet text area
  ];
  
  for (const selector of textareaSelectors) {
    const textareas = document.querySelectorAll(selector);
    console.log(`  📋 Found ${textareas.length} elements with selector: ${selector}`);
    
    for (const textarea of textareas) {
      // Verifikasi ini adalah textarea compose yang benar
      const isVisible = textarea.offsetParent !== null;
      const hasText = textarea.textContent !== undefined;
      const isEditable = textarea.contentEditable === 'true' || textarea.tagName === 'TEXTAREA';
      
      console.log(`    📝 Textarea check - Visible: ${isVisible}, HasText: ${hasText}, Editable: ${isEditable}`);
      
      if (isVisible && isEditable) {
        console.log(`✅ Found valid compose textarea with selector: ${selector}`);
        return textarea;
      }
    }
  }
  
  console.log('❌ No compose textarea found');
  return null;
}

// Fungsi untuk menemukan compose toolbar
function findComposeToolbar() {
  console.log('🔍 Looking for compose toolbar...');
  
  const textarea = findComposeTextarea();
  if (!textarea) {
    console.log('❌ No textarea found, cannot find toolbar');
    return null;
  }
  
  console.log('📍 Textarea found, searching for toolbar...');
  
  // Cari toolbar dengan berbagai metode
  const toolbarSelectors = [
    '[data-testid="toolBar"]', // Main toolbar
    '[role="group"]', // Generic group near textarea
    '.css-1dbjc4n[role="group"]', // Styled group
    '.r-18u37iz', // X.com toolbar class
    '.css-175oi2r.r-18u37iz', // Combined classes
    '.css-175oi2r[role="group"]', // Alternative styling
    '.r-1h0z5md', // Another X.com class
    '.css-1dbjc4n.r-1777fci', // Flex container
    'div[role="group"]', // Simple div group
  ];
  
  // Method 1: Look for toolbar in the same container as textarea
  console.log('🔍 Method 1: Looking in textarea container...');
  let container = textarea.closest('form') || textarea.closest('[data-testid="tweetTextarea_0_container"]') || textarea.closest('.css-1dbjc4n');
  let searchDepth = 0;
  
  while (container && searchDepth < 5) {
    console.log(`  📦 Searching container level ${searchDepth}:`, container.className);
    
    for (const selector of toolbarSelectors) {
      const toolbars = container.querySelectorAll(selector);
      console.log(`    🔍 Found ${toolbars.length} elements with selector: ${selector}`);
      
      for (const toolbar of toolbars) {
        // Verifikasi ini adalah toolbar yang benar
        const hasButtons = toolbar.querySelectorAll('button, [role="button"]').length > 0;
        const isVisible = toolbar.offsetParent !== null;
        
        console.log(`      🔧 Toolbar check - HasButtons: ${hasButtons}, Visible: ${isVisible}`);
        
        if (hasButtons && isVisible) {
          console.log(`✅ Found valid compose toolbar with selector: ${selector}`);
          return toolbar;
        }
      }
    }
    
    container = container.parentElement;
    searchDepth++;
  }
  
  // Method 2: Look for any visible toolbar on the page
  console.log('🔍 Method 2: Looking for any visible toolbar...');
  for (const selector of toolbarSelectors) {
    const toolbars = document.querySelectorAll(selector);
    console.log(`  📋 Found ${toolbars.length} elements with selector: ${selector}`);
    
    for (const toolbar of toolbars) {
      const hasButtons = toolbar.querySelectorAll('button, [role="button"]').length > 0;
      const isVisible = toolbar.offsetParent !== null;
      const isInCompose = toolbar.closest('form') || toolbar.closest('[data-testid*="compose"]') || toolbar.closest('[data-testid*="tweet"]');
      
      console.log(`    🔧 Toolbar check - HasButtons: ${hasButtons}, Visible: ${isVisible}, InCompose: ${!!isInCompose}`);
      
      if (hasButtons && isVisible) {
        console.log(`✅ Found valid toolbar with selector: ${selector}`);
        return toolbar;
      }
    }
  }
  
  // Method 3: Create toolbar if none found
  console.log('🔍 Method 3: Creating toolbar...');
  const textareaContainer = textarea.parentElement;
  if (textareaContainer) {
    // Look for existing button container or create one
    let buttonContainer = textareaContainer.querySelector('.css-1dbjc4n:has(button)') ||
                         textareaContainer.querySelector('[role="group"]');
    
    if (!buttonContainer) {
      // Create a simple container
      buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-top: 8px;';
      buttonContainer.setAttribute('role', 'group');
      textareaContainer.appendChild(buttonContainer);
      console.log('✅ Created new toolbar container');
    }
    
    return buttonContainer;
  }
  
  // Method 4: Create floating button as last resort
  console.log('🔍 Method 4: Creating floating button...');
  const floatingContainer = document.createElement('div');
  floatingContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #e1e8ed;
    border-radius: 20px;
    padding: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    backdrop-filter: blur(12px);
  `;
  floatingContainer.setAttribute('role', 'group');
  floatingContainer.id = 'ai-floating-toolbar';
  
  document.body.appendChild(floatingContainer);
  console.log('✅ Created floating toolbar as fallback');
  return floatingContainer;
}

// Fungsi untuk menambahkan AI response buttons ke compose area (sesuai screenshot)
function addAIButtonsToCompose() {
  console.log('🔧 Adding AI response buttons to compose area...');
  
  // Verify this is actually a compose page
  if (!isComposePage()) {
    console.log('⚠️ Not on compose page, skipping button addition');
    return;
  }
  
  // Clean up any existing buttons first
  const existingButtons = document.querySelectorAll('.ai-response-buttons');
  existingButtons.forEach(button => {
    button.remove();
    console.log('🗑️ Removed existing AI response buttons');
  });
  
  // Remove existing floating toolbar if any
  const existingFloating = document.getElementById('ai-floating-toolbar');
  if (existingFloating) {
    existingFloating.remove();
    console.log('🗑️ Removed existing floating toolbar');
  }
  
  const textarea = findComposeTextarea();
  if (!textarea) {
    console.log('❌ No compose textarea found, cannot add buttons');
    return;
  }
  
  console.log('✅ Compose textarea found, creating response buttons...');
  
  // Buat container untuk response buttons
  const aiButtons = createAIResponseButtons();
  
  // Event listeners untuk setiap button
  const buttons = aiButtons.querySelectorAll('.ai-option-btn');
  buttons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const responseType = e.currentTarget.getAttribute('data-type');
      const originalText = button.innerHTML;
      
      if (button.disabled) return;
      
      button.innerHTML = '⏳ Generating...';
      button.disabled = true;
      
      try {
        // Cari tweet context jika ini adalah reply
        let tweetElement = null;
        const isReplyCompose = window.location.href.includes('reply') || 
                              document.querySelector('[data-testid="tweet"]') ||
                              document.querySelector('[data-testid="tweetText"]');
        
        if (isReplyCompose) {
          tweetElement = document.querySelector('[data-testid="tweet"]') ||
                        document.querySelector('article[role="article"]');
        }
        
        await handleAIResponse(responseType, tweetElement);
        
      } catch (error) {
        console.error('Error generating response:', error);
        showErrorNotification('Terjadi kesalahan: ' + (error.message || 'Unknown error'));
      } finally {
        button.innerHTML = originalText;
        button.disabled = false;
      }
    });
  });
  
  // Find the best position - prominently placed near textarea
  const textareaContainer = textarea.closest('form') || 
                           textarea.closest('[role="main"]') ||
                           textarea.closest('.css-1dbjc4n') ||
                           textarea.parentElement;
  
  if (textareaContainer) {
    // Create floating bubble container
    const targetContainer = document.createElement('div');
    targetContainer.className = 'ai-floating-bubble';
    
    // Strategy: Position right after textarea, prominently visible
    const textareaWrapper = textarea.parentElement;
    
    // Position as floating bubble at top-right of container
    textareaContainer.style.position = 'relative';
    textareaContainer.appendChild(targetContainer);
    console.log('🎉 AI buttons positioned as floating bubble!');
    
    targetContainer.appendChild(aiButtons);
    
  } else {
    // Minimal floating fallback
    console.log('🔄 Using minimal floating buttons as fallback...');
    const floatingContainer = document.createElement('div');
    floatingContainer.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      z-index: 9999;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(29, 155, 240, 0.2);
      border-radius: 10px;
      padding: 2px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    floatingContainer.id = 'ai-floating-toolbar';
    floatingContainer.appendChild(aiButtons);
    document.body.appendChild(floatingContainer);
    console.log('🎉 AI response buttons added as minimal floating toolbar!');
  }
}

// Fungsi untuk handle AI response generation
async function handleAIResponse(responseType, tweetElement) {
  if (isProcessing) return;
  isProcessing = true;
  
  try {
    console.log(`🤖 Generating ${responseType} response...`);
    
    let tweetText = '';
    let tweetImages = [];
    
    if (tweetElement) {
      // Extract tweet content untuk context
      tweetText = extractTweetText(tweetElement);
      tweetImages = extractTweetImages(tweetElement);
      console.log('📄 Tweet context:', tweetText.substring(0, 100) + '...');
    }
    
    // Check extension context first
    if (!isExtensionContextValid()) {
      showErrorNotification('Extension perlu di-reload. Silakan refresh halaman dan coba lagi.');
      return;
    }
    
    // Send message to background script
    let response;
    try {
      response = await chrome.runtime.sendMessage({
        action: 'generateResponse',
        responseType: responseType,
        tweetText: tweetText,
        tweetImages: tweetImages
      });
    } catch (error) {
      console.error('Runtime message error:', error);
      if (error.message.includes('Extension context invalidated') || 
          error.message.includes('receiving end does not exist')) {
        showErrorNotification('Extension context bermasalah. Silakan refresh halaman dan coba lagi.');
        return;
      }
      showErrorNotification('Gagal berkomunikasi dengan extension. Coba lagi.');
      return;
    }
    
    if (response && response.success) {
      if (tweetElement) {
        // Fill reply textarea untuk tweet
        await fillReplyTextarea(tweetElement, response.content);
      } else {
        // Fill compose textarea untuk new tweet
        await fillComposeTextarea(response.content);
      }
      
      // Show success notification
      const successNotification = document.createElement('div');
      successNotification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ed573;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        z-index: 10001;
        font-size: 12px;
      `;
      successNotification.textContent = `⚡ ${responseType} response generated!`;
      document.body.appendChild(successNotification);
      
      setTimeout(() => {
        if (successNotification.parentNode) {
          successNotification.parentNode.removeChild(successNotification);
        }
      }, 2000);
      
    } else {
      const errorMsg = response ? response.error : 'Gagal generate response';
      showErrorNotification(errorMsg);
    }
  } catch (error) {
    console.error('Error:', error);
    showErrorNotification('Terjadi kesalahan: ' + (error.message || 'Unknown error'));
  } finally {
    isProcessing = false;
  }
}

// Fungsi untuk mengisi textarea reply otomatis dan enable reply button
async function fillReplyTextarea(tweetElement, replyText) {
  console.log('🔧 Filling reply textarea...');
  
  // Always copy to clipboard as primary method
  try {
    await navigator.clipboard.writeText(replyText);
    showSuccessNotification('✅ AI reply copied to clipboard! Ready to paste & reply');
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    showErrorNotification('❌ Copy failed. Content: ' + replyText);
  }
  
  // Also try to fill reply textarea if available
  let replyTextarea = document.querySelector('[data-testid="tweetTextarea_0"]');
  
  if (!replyTextarea) {
    // Try to open reply dialog
    const replyButton = tweetElement?.querySelector('[data-testid="reply"]');
    if (replyButton) {
      console.log('🔄 Opening reply dialog...');
      replyButton.click();
      
      // Wait for dialog
      await new Promise(resolve => setTimeout(resolve, 1000));
      replyTextarea = document.querySelector('[data-testid="tweetTextarea_0"]');
    }
  }
  
  if (replyTextarea) {
    console.log('✅ Also filling reply textarea...');
    
    replyTextarea.focus();
    
    // Simple filling method
    if (replyTextarea.contentEditable === 'true') {
      replyTextarea.innerHTML = '';
      replyTextarea.textContent = replyText;
    } else if (replyTextarea.tagName === 'TEXTAREA') {
      replyTextarea.value = replyText;
    }
    
    // Trigger input event to enable reply button
    const inputEvent = new Event('input', { bubbles: true });
    replyTextarea.dispatchEvent(inputEvent);
    
    const changeEvent = new Event('change', { bubbles: true });
    replyTextarea.dispatchEvent(changeEvent);
    
    // Wait and try to enable reply button
    setTimeout(() => {
      enableReplyButton();
    }, 500);
    
    console.log('✅ Reply textarea filled and reply button enabled');
  }
}

// Fungsi untuk mengisi compose textarea dan enable post button
async function fillComposeTextarea(content) {
  console.log('🔧 Filling compose textarea...');
  
  // Always copy to clipboard as primary method
  try {
    await navigator.clipboard.writeText(content);
    showSuccessNotification('✅ AI content copied to clipboard! Ready to post');
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    showErrorNotification('❌ Copy failed. Content: ' + content);
  }
  
  // Also try to fill textarea if available
  const composeTextarea = findComposeTextarea();
  if (composeTextarea) {
    console.log('✅ Also filling compose textarea...');
    
    // Focus textarea first
    composeTextarea.focus();
    
    // Clear and insert content
    if (composeTextarea.contentEditable === 'true') {
      composeTextarea.innerHTML = '';
      composeTextarea.textContent = content;
    } else if (composeTextarea.tagName === 'TEXTAREA') {
      composeTextarea.value = content;
    }
    
    // Trigger events to enable post button
    const inputEvent = new Event('input', { bubbles: true });
    composeTextarea.dispatchEvent(inputEvent);
    
    const changeEvent = new Event('change', { bubbles: true });
    composeTextarea.dispatchEvent(changeEvent);
    
    // Wait and try to enable post/reply button
    setTimeout(() => {
      enablePostButton();
    }, 500);
    
    console.log('✅ Textarea filled and post button enabled');
  }
}

// Fungsi untuk mengaktifkan reply button
function enableReplyButton() {
  console.log('🔧 Trying to enable reply button...');
  
  const replySelectors = [
    '[data-testid="tweetButton"]',
    '[data-testid="tweetButtonInline"]', 
    'button[type="submit"]',
    'button:contains("Reply")',
    '[role="button"]:contains("Reply")'
  ];
  
  for (const selector of replySelectors) {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(button => {
      if (button && (button.textContent.includes('Reply') || button.getAttribute('data-testid') === 'tweetButton')) {
        button.disabled = false;
        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
        button.classList.remove('disabled');
        console.log('✅ Reply button enabled:', button);
      }
    });
  }
}

// Fungsi untuk mengaktifkan post button 
function enablePostButton() {
  console.log('🔧 Trying to enable post button...');
  
  const postSelectors = [
    '[data-testid="tweetButton"]',
    '[data-testid="tweetButtonInline"]',
    'button[type="submit"]',
    'button:contains("Post")',
    'button:contains("Tweet")',
    '[role="button"]:contains("Post")'
  ];
  
  for (const selector of postSelectors) {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(button => {
      if (button && (button.textContent.includes('Post') || button.textContent.includes('Tweet') || button.getAttribute('data-testid') === 'tweetButton')) {
        button.disabled = false;
        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
        button.classList.remove('disabled');
        console.log('✅ Post button enabled:', button);
      }
    });
  }
}

// Function to show success notification - Flat Design
function showSuccessNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: rgb(231, 233, 234);
    padding: 8px 16px;
    border: 1px solid rgba(113, 118, 123, 0.3);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    z-index: 10001;
    font-size: 12px;
    font-weight: 400;
    max-width: 280px;
    word-wrap: break-word;
    animation: slideIn 0.2s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.2s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 200);
    }
  }, 4000);
}

// Fungsi untuk memproses compose page (reply atau new tweet)
function processComposePage() {
  console.log('🔍 Processing compose page...');
  
  // Debug: Show current URL and page type
  const currentUrl = window.location.href;
  const pageTypes = {
    isComposePost: currentUrl.includes('/compose/post'),
    isComposeTweet: currentUrl.includes('/compose/tweet'),
    isReplyPage: currentUrl.includes('reply') || 
                 document.querySelector('[data-testid="tweet"]') ||
                 document.querySelector('[data-testid="tweetText"]')
  };
  
  console.log('📍 Page analysis:');
  console.log(`   URL: ${currentUrl}`);
  console.log(`   Page types:`, pageTypes);
  
  // Special handling for compose/post page
  if (pageTypes.isComposePost) {
    console.log('📝 Detected compose/post page - using enhanced detection...');
    
    // Wait a bit for the page to fully load
    setTimeout(() => {
      const textarea = findComposeTextarea();
      if (textarea) {
        console.log('✅ Found textarea on compose/post page, adding buttons...');
        addAIButtonsToCompose();
      } else {
        console.log('⏰ Textarea not ready yet on compose/post, will retry...');
        // Try again after a longer wait
        setTimeout(() => {
          if (findComposeTextarea()) {
            addAIButtonsToCompose();
          }
        }, 2000);
      }
    }, 1000);
  }
  
  // Debug textarea elements
  const allTextareas = document.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"]');
  console.log(`📝 Found ${allTextareas.length} potential text input elements:`);
  allTextareas.forEach((el, i) => {
    const isVisible = el.offsetParent !== null;
    const isEditable = el.contentEditable === 'true' || el.tagName === 'TEXTAREA';
    const hasPlaceholder = el.placeholder || el.getAttribute('placeholder');
    console.log(`  ${i+1}. ${el.tagName} - Visible: ${isVisible}, Editable: ${isEditable}, Placeholder: "${hasPlaceholder || 'none'}"`);
  });
  
  // Cek apakah ada compose textarea
  const textarea = findComposeTextarea();
  if (textarea) {
    console.log('✅ Found compose textarea, adding AI response buttons...');
    addAIButtonsToCompose();
  } else {
    console.log('❌ No compose textarea found yet');
    
    // Fallback: cari textarea yang visible dan editable
    const visibleTextareas = Array.from(allTextareas).filter(el => 
      el.offsetParent !== null && 
      (el.contentEditable === 'true' || el.tagName === 'TEXTAREA')
    );
    
    if (visibleTextareas.length > 0) {
      console.log(`🔄 Found ${visibleTextareas.length} visible editable areas, trying to add buttons...`);
      addAIButtonsToCompose();
    }
  }
}

// Fungsi untuk memproses semua tweets di halaman (BlitzX style)
function processTweets() {
  console.log('🔍 Processing tweets...');
  
  // Coba berbagai selector untuk tweet
  const tweetSelectors = [
    '[data-testid="tweet"]',
    '[data-testid="tweetDetail"]', 
    'article[data-testid="tweet"]',
    'article[role="article"]',
    'div[data-testid="tweet"]',
    '.r-1loqt21', // Twitter's tweet container class
    '.css-1dbjc4n[data-testid="tweet"]',
    'article', // Fallback ke semua articles
  ];
  
  let tweets = [];
  let usedSelector = '';
  
  for (const selector of tweetSelectors) {
    tweets = document.querySelectorAll(selector);
    if (tweets.length > 0) {
      usedSelector = selector;
      break;
    }
  }
  
  console.log(`📊 Found ${tweets.length} tweets using selector: ${usedSelector}`);
  
  if (tweets.length === 0) {
    console.log('❌ No tweets found. DOM might not be ready yet.');
    return;
  }
  
  tweets.forEach((tweet, index) => {
    // Pastikan tweet tidak sudah memiliki AI button
    if (!tweet.querySelector('.blitz-ai-reply-btn')) {
      console.log(`➕ Adding AI button to tweet ${index + 1}`);
      addAIButtonToTweet(tweet);
    } else {
      console.log(`✅ Tweet ${index + 1} already has AI button`);
    }
  });
}

// Main processing function based on page type
function processPage() {
  if (isComposePage()) {
    console.log('📝 Compose/Reply page detected, processing compose area...');
    processComposePage();
  } else {
    console.log('🏠 Feed page detected, processing tweets...');
    processTweets();
  }
}

// Observer untuk mendeteksi tweet baru (BlitzX style)
const observer = new MutationObserver((mutations) => {
  let shouldProcess = false;
  
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Cek apakah node adalah tweet atau container yang berisi tweet
          if (node.querySelector && (
            node.querySelector('[data-testid="tweet"]') ||
            node.matches('[data-testid="tweet"]') ||
            node.querySelector('[role="article"]') ||
            node.matches('[role="article"]')
          )) {
            shouldProcess = true;
          }
        }
      });
    }
  });
  
  if (shouldProcess) {
    console.log('🔄 DOM changes detected, processing page...');
    setTimeout(processPage, 300); // Delay untuk memastikan DOM sudah siap
  }
});

// Mulai observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Proses page yang sudah ada saat script dimuat
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, waiting 2s then processing page...');
    setTimeout(processPage, 2000); // X.com might need more time
    
    // Additional check for compose pages
    if (window.location.href.includes('/compose/')) {
      setTimeout(() => {
        console.log('🔄 Additional compose page check...');
        processPage();
      }, 4000);
    }
  });
} else {
  console.log('📄 Document already ready, waiting 1s then processing page...');
  setTimeout(processPage, 1000); // Give X.com some time to render
  
  // Additional check for compose pages
  if (window.location.href.includes('/compose/')) {
    setTimeout(() => {
      console.log('🔄 Additional compose page check...');
      processPage();
    }, 3000);
  }
}

// Smart interval check - only process if something might have changed
let lastPageType = null;
setInterval(() => {
  const currentPageType = isComposePage() ? 'compose' : 'feed';
  
  // Only process if page type changed or if it's been a while
  if (currentPageType !== lastPageType) {
    console.log(`⏰ Page type changed from ${lastPageType} to ${currentPageType}, processing...`);
    lastPageType = currentPageType;
    processPage();
  } else {
    // Occasional check to ensure nothing was missed
    const checkInterval = Math.random() < 0.3; // 30% chance
    if (checkInterval) {
      console.log('⏰ Periodic check: processing page...');
      processPage();
    }
  }
}, isComposePage() ? 8000 : 5000); // Longer intervals, less frequent processing

// Debug functions available in console
window.debugTwitterAI = {
  // Find all potential textareas
  findTextareas: () => {
    const elements = document.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"], [data-testid*="tweet"], [placeholder*="What"]');
    console.log(`Found ${elements.length} potential textarea elements:`);
    elements.forEach((el, i) => {
      console.log(`${i+1}.`, el, {
        tag: el.tagName,
        role: el.getAttribute('role'),
        testid: el.getAttribute('data-testid'),
        placeholder: el.placeholder || el.getAttribute('placeholder'),
        editable: el.contentEditable,
        visible: el.offsetParent !== null,
        text: el.textContent?.substring(0, 50) || 'empty'
      });
    });
    return elements;
  },
  
  // Find all potential toolbars
  findToolbars: () => {
    const elements = document.querySelectorAll('[role="group"], [data-testid*="toolBar"], [data-testid*="tool"], button');
    console.log(`Found ${elements.length} potential toolbar elements:`);
    elements.forEach((el, i) => {
      const buttons = el.querySelectorAll('button, [role="button"]').length;
      console.log(`${i+1}.`, el, {
        tag: el.tagName,
        role: el.getAttribute('role'),
        testid: el.getAttribute('data-testid'),
        buttons: buttons,
        visible: el.offsetParent !== null,
        classes: el.className.substring(0, 100)
      });
    });
    return elements;
  },
  
  // Force add AI button
  forceAddButton: () => {
    console.log('🔧 Force adding AI response buttons...');
    addAIButtonsToCompose();
  },
  
  // Test selectors
  testSelector: (selector) => {
    const elements = document.querySelectorAll(selector);
    console.log(`Selector "${selector}" found ${elements.length} elements:`, elements);
    return elements;
  }
};

console.log('✅ Twitter AI Reply Assistant loaded and ready!');
console.log('🔧 Debug tools available: window.debugTwitterAI');
console.log('   - debugTwitterAI.findTextareas()');
console.log('   - debugTwitterAI.findToolbars()'); 
console.log('   - debugTwitterAI.forceAddButton()');
console.log('   - debugTwitterAI.testSelector("your-selector")'); 