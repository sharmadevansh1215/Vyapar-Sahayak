import { useState, useEffect, useRef, useCallback } from 'react';
import { BusinessCategory, Language, LocationState, WeatherContext, FeasibilityInsights, GroundingSource, StreamingFeasibilityChunk } from '../types';

interface UseFeasibilityStreamProps {
  selectedCategory: BusinessCategory;
  location: LocationState;
  marginCapital: number;
  currentLanguage: Language;
  weather: WeatherContext | null;
}

export function useFeasibilityStream({
  selectedCategory,
  location,
  marginCapital,
  currentLanguage,
  weather,
}: UseFeasibilityStreamProps) {
  const [insights, setInsights] = useState<FeasibilityInsights | null>(null);
  const [streamedText, setStreamedText] = useState<string>('');
  const [executiveSummary, setExecutiveSummary] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [modelUsed, setModelUsed] = useState<string>('gemini-3.7-flash (Live Google Search Grounding)');
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsLoading(false);
  }, []);

  const triggerStream = useCallback(async () => {
    cancelStream();
    setIsLoading(true);
    setIsStreaming(true);
    setStreamedText('');
    setExecutiveSummary('');
    setError(null);
    setTokenCount(0);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/feasibility/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          categoryId: selectedCategory.id,
          categoryName: selectedCategory.name,
          location,
          marginCapital,
          language: currentLanguage,
          weather,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Stream request failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body stream reader unavailable');
      }

      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedFullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;

          try {
            const data: StreamingFeasibilityChunk = JSON.parse(jsonStr);

            if (data.type === 'init') {
              if (data.modelUsed) setModelUsed(data.modelUsed);
            } else if (data.type === 'chunk') {
              if (data.text) {
                accumulatedFullText += data.text;
                setStreamedText((prev) => prev + (data.text || ''));
                setTokenCount((prev) => prev + (data.text?.split(/\s+/).length || 1));
              }
              if (data.groundingSources && data.groundingSources.length > 0) {
                setGroundingSources(data.groundingSources);
              }
              if (data.modelUsed) {
                setModelUsed(data.modelUsed);
              }
            } else if (data.type === 'complete') {
              if (data.insights) {
                setInsights(data.insights);
                if (data.insights.executiveSummary) {
                  setExecutiveSummary(data.insights.executiveSummary);
                }
              }
              if (data.groundingSources && data.groundingSources.length > 0) {
                setGroundingSources(data.groundingSources);
              }
              if (data.modelUsed) {
                setModelUsed(data.modelUsed);
              }
              setIsStreaming(false);
              setIsLoading(false);
            } else if (data.type === 'error') {
              setError(data.error || 'Streaming error occurred');
              if (data.insights) {
                setInsights(data.insights);
              }
              setIsStreaming(false);
              setIsLoading(false);
            }
          } catch {
            // Partial chunk or cut off JSON line across network packet, handled gracefully
          }
        }
      }

      // Check remaining buffer if any
      if (buffer.trim().startsWith('data:')) {
        const remainingStr = buffer.trim().slice(5).trim();
        if (remainingStr && remainingStr !== '[DONE]') {
          try {
            const data: StreamingFeasibilityChunk = JSON.parse(remainingStr);
            if (data.type === 'complete' && data.insights) {
              setInsights(data.insights);
            }
          } catch {
            // Gracefully ignore incomplete final fragment
          }
        }
      }

      // If finished stream but complete event wasn't captured, clean up
      setIsStreaming(false);
      setIsLoading(false);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.info('Feasibility stream aborted by user navigation');
        return;
      }
      console.warn('Streaming fetch failed, falling back to standard API:', err);
      setError(err?.message || 'Streaming failed');
      setIsStreaming(false);
      setIsLoading(false);

      // Fallback to standard endpoint
      try {
        const fallbackRes = await fetch('/api/feasibility', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoryId: selectedCategory.id,
            categoryName: selectedCategory.name,
            location,
            marginCapital,
            language: currentLanguage,
            weather,
          }),
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackData?.insights) {
          setInsights(fallbackData.insights);
          if (fallbackData.groundingSources) {
            setGroundingSources(fallbackData.groundingSources);
          }
        }
      } catch (fallbackErr) {
        console.error('Fallback endpoint also failed:', fallbackErr);
      }
    }
  }, [
    cancelStream,
    selectedCategory.id,
    selectedCategory.name,
    location,
    marginCapital,
    currentLanguage,
    weather,
  ]);

  useEffect(() => {
    triggerStream();
    return () => {
      cancelStream();
    };
  }, [triggerStream, cancelStream]);

  return {
    insights,
    streamedText,
    executiveSummary,
    isStreaming,
    isLoading,
    groundingSources,
    modelUsed,
    tokenCount,
    error,
    triggerStream,
    cancelStream,
  };
}
