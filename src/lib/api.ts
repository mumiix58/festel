```typescript
// Update error handling
const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, backoff = 1000) => {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          'x-retry-count': String(i)
        }
      });
      
      clearTimeout(timeoutId);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          const newOptions = {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          };
          return await fetch(url, newOptions);
        } else {
          if (isAdminRoute()) {
            logoutUser();
          }
          throw new Error('Authentication required');
        }
      }
      
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      
      // Don't retry if we aborted or if it's an auth error
      if (error instanceof Error && (error.name === 'AbortError' || error.message === 'Authentication required')) {
        throw lastError;
      }
      
      // Only retry if we have attempts left
      if (i === retries - 1) break;
      
      // Wait with exponential backoff before retrying
      await wait(backoff * Math.pow(2, i));
      
      console.log(`Retrying request (${i + 1}/${retries})`);
    }
  }
  
  throw lastError;
};
```