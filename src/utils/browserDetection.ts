export const isMobileBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
         /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
         !!(navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
};

export const getSpeechRecognitionConfig = () => {
  const isMobile = isMobileBrowser();
  
  return {
    isMobile,
    restartDelay: isMobile ? 1500 : 100,
    maxRetries: isMobile ? 2 : 5,
    continuous: !isMobile,
    retryDelay: isMobile ? 2000 : 300
  };
};
