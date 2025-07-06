// Popup script untuk Twitter AI Reply Assistant - Multi API Support

document.addEventListener('DOMContentLoaded', async () => {
    // Get DOM elements
    const apiProviderSelect = document.getElementById('apiProvider');
    const geminiConfig = document.getElementById('geminiConfig');
    const openaiConfig = document.getElementById('openaiConfig');
    const openaiFreeConfig = document.getElementById('openaiFreeConfig');
    const geminiApiKeyInput = document.getElementById('geminiApiKey');
    const openaiApiKeyInput = document.getElementById('openaiApiKey');
    const openaiModelSelect = document.getElementById('openaiModel');
    const openaiFreePlatformSelect = document.getElementById('openaiFreePlatform');
    const toggleGeminiVisibilityBtn = document.getElementById('toggleGeminiVisibility');
    const toggleOpenaiVisibilityBtn = document.getElementById('toggleOpenaiVisibility');
    const saveKeyBtn = document.getElementById('saveKey');
    const testKeyBtn = document.getElementById('testKey');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');

    // Load saved settings
    await loadSettings();

    // Event listeners
    apiProviderSelect.addEventListener('change', onProviderChange);
    toggleGeminiVisibilityBtn.addEventListener('click', () => toggleApiKeyVisibility('gemini'));
    toggleOpenaiVisibilityBtn.addEventListener('click', () => toggleApiKeyVisibility('openai'));
    saveKeyBtn.addEventListener('click', saveConfiguration);
    testKeyBtn.addEventListener('click', testCurrentProvider);

    // Auto-save on input changes
    geminiApiKeyInput.addEventListener('input', debounce(saveConfiguration, 1000));
    openaiApiKeyInput.addEventListener('input', debounce(saveConfiguration, 1000));
    openaiModelSelect.addEventListener('change', saveConfiguration);
    openaiFreePlatformSelect.addEventListener('change', saveConfiguration);

    // Load and display saved settings
    async function loadSettings() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getConfiguration' });
            if (response.success && response.config) {
                const config = response.config;
                
                // Set provider
                apiProviderSelect.value = config.provider || 'gemini';
                
                // Set API keys
                if (config.geminiApiKey) {
                    geminiApiKeyInput.value = config.geminiApiKey;
                }
                if (config.openaiApiKey) {
                    openaiApiKeyInput.value = config.openaiApiKey;
                }
                
                // Set OpenAI model
                if (config.openaiModel) {
                    openaiModelSelect.value = config.openaiModel;
                }
                
                // Set OpenAI Free platform
                if (config.openaiFreePlatform) {
                    openaiFreePlatformSelect.value = config.openaiFreePlatform;
                }
                
                // Update UI based on provider
                updateProviderUI();
                
                // Test current provider if key is available
                await testCurrentProvider(false);
                
                let providerName = config.provider === 'openai' ? 'OpenAI' : 
                                  config.provider === 'openai-free' ? 'OpenAI Free' : 'Gemini';
                updateStatus('success', `${providerName} configured`);
            } else {
                updateStatus('error', 'No API configuration found');
                updateProviderUI();
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            updateStatus('error', 'Error loading settings');
            updateProviderUI();
        }
    }

    // Handle provider change
    function onProviderChange() {
        updateProviderUI();
        saveConfiguration();
    }

    // Update UI based on selected provider
    function updateProviderUI() {
        const provider = apiProviderSelect.value;
        
        // Hide all configs first
        geminiConfig.style.display = 'none';
        openaiConfig.style.display = 'none';
        openaiFreeConfig.style.display = 'none';
        geminiConfig.classList.remove('active');
        openaiConfig.classList.remove('active');
        openaiFreeConfig.classList.remove('active');
        
        // Show the selected provider config
        if (provider === 'gemini') {
            geminiConfig.style.display = 'block';
            geminiConfig.classList.add('active');
        } else if (provider === 'openai') {
            openaiConfig.style.display = 'block';
            openaiConfig.classList.add('active');
        } else if (provider === 'openai-free') {
            openaiFreeConfig.style.display = 'block';
            openaiFreeConfig.classList.add('active');
        }
    }

    // Toggle API key visibility
    function toggleApiKeyVisibility(provider) {
        let input, button;
        
        if (provider === 'gemini') {
            input = geminiApiKeyInput;
            button = toggleGeminiVisibilityBtn;
        } else if (provider === 'openai') {
            input = openaiApiKeyInput;
            button = toggleOpenaiVisibilityBtn;
        }
        
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        button.textContent = isPassword ? '🙈' : '👁️';
    }

    // Save complete configuration
    async function saveConfiguration() {
        const provider = apiProviderSelect.value;
        const geminiApiKey = geminiApiKeyInput.value.trim();
        const openaiApiKey = openaiApiKeyInput.value.trim();
        const openaiModel = openaiModelSelect.value;
        const openaiFreePlatform = openaiFreePlatformSelect.value;

        // Validate current provider has API key (except for OpenAI Free)
        if (provider === 'gemini' && !geminiApiKey) {
            updateStatus('error', 'Please enter Gemini API key');
            return;
        }
        if (provider === 'openai' && !openaiApiKey) {
            updateStatus('error', 'Please enter OpenAI API key');
            return;
        }
        // OpenAI Free doesn't need API key validation

        try {
            saveKeyBtn.classList.add('loading');
            saveKeyBtn.disabled = true;
            updateStatus('', 'Saving configuration...');

            const config = {
                provider,
                geminiApiKey,
                openaiApiKey,
                openaiModel,
                openaiFreePlatform
            };

            const response = await chrome.runtime.sendMessage({
                action: 'setConfiguration',
                config: config
            });

            if (response.success) {
                let providerName = provider === 'openai' ? 'OpenAI' : 
                                  provider === 'openai-free' ? 'OpenAI Free' : 'Gemini';
                updateStatus('success', `${providerName} configuration saved`);
            } else {
                updateStatus('error', 'Failed to save configuration: ' + response.error);
            }
        } catch (error) {
            console.error('Error saving configuration:', error);
            updateStatus('error', 'Error saving configuration');
        } finally {
            saveKeyBtn.classList.remove('loading');
            saveKeyBtn.disabled = false;
        }
    }

    // Test current provider
    async function testCurrentProvider(showUserFeedback = true) {
        const provider = apiProviderSelect.value;
        let apiKey = null;
        let model = null;
        
        if (provider === 'gemini') {
            apiKey = geminiApiKeyInput.value.trim();
            if (!apiKey) {
                updateStatus('error', 'Please enter Gemini API key first');
                return;
            }
        } else if (provider === 'openai') {
            apiKey = openaiApiKeyInput.value.trim();
            model = openaiModelSelect.value;
            if (!apiKey) {
                updateStatus('error', 'Please enter OpenAI API key first');
                return;
            }
        } else if (provider === 'openai-free') {
            // OpenAI Free doesn't need API key
            apiKey = null;
            model = openaiFreePlatformSelect.value;
        }

        await testApiConnection(provider, apiKey, model, showUserFeedback);
    }

    // Test API connection
    async function testApiConnection(provider, apiKey, model, showUserFeedback = true) {
        try {
            if (showUserFeedback) {
                testKeyBtn.classList.add('loading');
                testKeyBtn.disabled = true;
                let providerName = provider === 'openai' ? 'OpenAI' : 
                                  provider === 'openai-free' ? 'OpenAI Free' : 'Gemini';
                updateStatus('', `Testing ${providerName} connection...`);
            }

            const response = await chrome.runtime.sendMessage({
                action: 'testApiConnection',
                provider,
                apiKey,
                model
            });

            if (response.success) {
                let providerName = provider === 'openai' ? 'OpenAI' : 
                                  provider === 'openai-free' ? 'OpenAI Free' : 'Gemini';
                updateStatus('success', `${providerName} is working! ✅`);
                if (showUserFeedback) {
                    showNotification(`${providerName} test successful!`, 'success');
                }
            } else {
                let providerName = provider === 'openai' ? 'OpenAI' : 
                                  provider === 'openai-free' ? 'OpenAI Free' : 'Gemini';
                updateStatus('error', `${providerName} test failed: ` + response.error);
                if (showUserFeedback) {
                    showNotification(`${providerName} test failed: ` + response.error, 'error');
                }
            }
        } catch (error) {
            console.error('Error testing API:', error);
            updateStatus('error', 'Error testing API connection');
            if (showUserFeedback) {
                showNotification('Error testing API connection', 'error');
            }
        } finally {
            if (showUserFeedback) {
                testKeyBtn.classList.remove('loading');
                testKeyBtn.disabled = false;
            }
        }
    }

    // Update status display
    function updateStatus(type, message) {
        statusIndicator.className = 'status-indicator';
        if (type) {
            statusIndicator.classList.add(type);
        }
        statusText.textContent = message;
    }

    // Show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification {
            transform: translateX(100%);
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
});

// Handle external links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.target === '_blank') {
        e.preventDefault();
        chrome.tabs.create({ url: e.target.href });
    }
}); 