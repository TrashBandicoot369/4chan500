import React, { useState, useEffect } from 'react';
import type { MemeTicker } from '@/lib/types';

interface ComicBubbleProps {
  memes: MemeTicker[];
}

export function ComicBubble({ memes }: ComicBubbleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [text, setText] = useState('');
  const [bubbleStyle, setBubbleStyle] = useState(Math.floor(Math.random() * 3));

  useEffect(() => {
    // Add click event listener to the entire document
    const handleClick = (e: MouseEvent) => {
      // Ignore clicks on the comic bubble itself to prevent flickering
      if ((e.target as Element)?.closest('.comic-bubble')) {
        return;
      }

      // If the bubble is already visible, hide it first
      if (isVisible) {
        setIsVisible(false);
        
        // Wait a bit before showing the new bubble
        setTimeout(() => {
          showBubble(e.clientX, e.clientY);
        }, 100);
      } else {
        showBubble(e.clientX, e.clientY);
      }
    };

    const showBubble = (x: number, y: number) => {
      // Get a random meme title from the memes array
      if (memes && memes.length > 0) {
        const randomIndex = Math.floor(Math.random() * memes.length);
        const randomMeme = memes[randomIndex];
        setText(randomMeme.title);
        
        // Generate random position adjustments 
        const xOffset = Math.random() * 100 - 50; // -50 to 50
        const yOffset = Math.random() * 100 - 50; // -50 to 50
        
        // Set position with some offset to make it more interesting
        setPosition({ 
          x: Math.max(0, x + xOffset), 
          y: Math.max(0, y + yOffset) 
        });
        
        // Randomize bubble style
        setBubbleStyle(Math.floor(Math.random() * 3));
        
        // Show the bubble
        setIsVisible(true);
        
        // Hide the bubble after a random time (1.5-3 seconds)
        setTimeout(() => {
          setIsVisible(false);
        }, 1500 + Math.random() * 1500);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [memes, isVisible]);

  if (!isVisible) return null;

  // Different bubble styles (classic comic, thought bubble, explosive)
  const bubbleStyles = [
    'comic-bubble-speech',   // Regular speech bubble
    'comic-bubble-thought',  // Thought bubble 
    'comic-bubble-explosion' // Explosion bubble
  ];

  return (
    <div 
      className={`comic-bubble ${bubbleStyles[bubbleStyle]}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        maxWidth: '300px',
        padding: '15px',
        backgroundColor: bubbleStyle === 2 ? '#ffec4f' : '#ffffff',
        color: '#000000',
        borderRadius: bubbleStyle === 1 ? '50%' : '4px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        fontFamily: 'Comic Sans MS, cursive, sans-serif',
        fontWeight: 'bold',
        fontSize: '16px',
        textAlign: 'center',
        animation: 'pop-in 0.3s forwards'
      }}
    >
      {text}
    </div>
  );
} 