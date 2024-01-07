'use client';

export function setItem(property, value) {
    if (process.browser && window.localStorage) {
      return window.localStorage.setItem(property, JSON.stringify(value));
    }
  
    return null;
  }
  
  export function getItem(property) {
    if (process.browser && window.localStorage) {
       const value = window.localStorage.getItem(property);
       return value || ''
    }
    return '';
  }
  