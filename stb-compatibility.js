// File: stb-compatibility.js
// Compatibility fixes for STB browser

(function() {
  'use strict';
  
  // Fix untuk Promise jika tidak ada
  if (typeof Promise === 'undefined') {
    window.Promise = function(executor) {
      this.state = 'pending';
      this.value = undefined;
      this.reason = undefined;
      this.onFulfilled = [];
      this.onRejected = [];
      
      const resolve = (value) => {
        if (this.state === 'pending') {
          this.state = 'fulfilled';
          this.value = value;
          this.onFulfilled.forEach(fn => fn(value));
        }
      };
      
      const reject = (reason) => {
        if (this.state === 'pending') {
          this.state = 'rejected';
          this.reason = reason;
          this.onRejected.forEach(fn => fn(reason));
        }
      };
      
      try {
        executor(resolve, reject);
      } catch (error) {
        reject(error);
      }
    };
    
    Promise.prototype.then = function(onFulfilled, onRejected) {
      if (this.state === 'fulfilled') {
        onFulfilled(this.value);
      } else if (this.state === 'rejected') {
        onRejected(this.reason);
      } else {
        this.onFulfilled.push(onFulfilled);
        this.onRejected.push(onRejected);
      }
      return this;
    };
    
    Promise.prototype.catch = function(onRejected) {
      return this.then(null, onRejected);
    };
  }
  
  // Fix untuk fetch jika tidak ada
  if (typeof window.fetch === 'undefined') {
    window.fetch = function(url) {
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              ok: true,
              json: function() {
                return Promise.resolve(JSON.parse(xhr.responseText));
              },
              text: function() {
                return Promise.resolve(xhr.responseText);
              }
            });
          } else {
            reject(new Error(xhr.statusText));
          }
        };
        xhr.onerror = function() {
          reject(new Error('Network error'));
        };
        xhr.send();
      });
    };
  }
  
  // Fix untuk audio autoplay
  document.addEventListener('DOMContentLoaded', function() {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(function(audio) {
      audio.setAttribute('preload', 'none');
    });
  });
  
  // Fix untuk localStorage yang error
  var storage;
  try {
    storage = localStorage;
  } catch (e) {
    storage = {
      data: {},
      setItem: function(key, value) {
        this.data[key] = value;
      },
      getItem: function(key) {
        return this.data[key] || null;
      },
      removeItem: function(key) {
        delete this.data[key];
      },
      clear: function() {
        this.data = {};
      }
    };
    window.localStorage = storage;
  }
  
  // Console fallback
  if (!window.console) {
    window.console = {
      log: function() {},
      error: function() {},
      warn: function() {},
      info: function() {}
    };
  }
  
})();