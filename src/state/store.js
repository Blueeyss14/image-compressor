import React, { useState } from 'react';

const createStore = (initialState) => {
  let state = initialState;
  const listeners = new Set();
  
  const setState = (updater) => {
    const newState = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
    state = newState;
    listeners.forEach(listener => listener(state));
  };
  
  const getState = () => state;
  
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  
  return { setState, getState, subscribe };
};

export const imageStore = createStore({
  images: [],
  quality: 80,
  processing: false
});

export const imageActions = {
  setImages: (images) => imageStore.setState({ images }),
  setQuality: (quality) => imageStore.setState({ quality }),
  setProcessing: (processing) => imageStore.setState({ processing }),
  
  addImage: (image) => imageStore.setState(prev => ({ 
    images: [...prev.images, image] 
  })),
  
  removeImage: (id) => imageStore.setState(prev => ({ 
    images: prev.images.filter(img => img.id !== id) 
  })),
  
  clearImages: () => imageStore.setState({ images: [] }),
  
  updateImages: (updatedImages) => imageStore.setState({ images: updatedImages })
};

export const useImageStore = () => {
  const [, forceUpdate] = useState({});
  
  React.useEffect(() => {
    const unsubscribe = imageStore.subscribe(() => forceUpdate({}));
    return unsubscribe;
  }, []);
  
  return {
    ...imageStore.getState(),
    ...imageActions
  };
};