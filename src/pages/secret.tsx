import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import InitialTransition from '../components/InitialTransition';
import '../styles/globals.css';

const frameContent = {
  animate: {
    transition: { staggerChildren: 0.1, delayChildren: 2.8 },
  },
};


const text = {
  initial: { y: -20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};


function Secret() {
  const router = useRouter();
  const [content, setContent] = useState<string | null>(null);
  const [counter, setCounter] = useState(5); 
  const [animateTransition, setAnimateTransition] = useState(false);
  

  useEffect(() => {
    setAnimateTransition(true);
  }, []);


  useEffect(() => {
    if (router.isReady) {
      const secretContent = sessionStorage.getItem('secretContent') as string;
      setContent(secretContent);
  
      sessionStorage.removeItem('secretContent');
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!content && counter > 0) {
      const timerId = setInterval(() => {
        setCounter(prevCounter => prevCounter - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }

    if (counter === 0) {
      router.push('/');
    }
  }, [content, counter, router]);

  if (!content) {
    return <div className="counter-box">
              <p className="counter-text">{"Lost? Don't worry, you will be redirected in"}</p>
            <p className="counter">{counter}</p>
        </div>

  }

  return (
<div>
  {animateTransition && <InitialTransition />}

  <motion.section exit={{ opacity: 0 }}>
    <motion.div
      initial="initial"
      animate="animate"
      variants={frameContent}
      className="space-y-12"
    >
      <div className="secret-container">
        <div className="md:flex md:mt-8 mb-24 items-center justify-between">
          <div className="secret-body md:mt-8 text-left">
            <motion.div 
              variants={text}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  </motion.section>
</div>

  );
}

export default Secret;


