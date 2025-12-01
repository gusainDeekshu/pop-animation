"use client";

import { TransitionRouter } from "next-transition-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const BLOCK_SIZE = 60;

const TransitionProvider = ({ children }) => {
  const transitionGridRef = useRef(null);
  const blocksRef = useRef([]);

  const createTransitionGrid = () => {
    if (!transitionGridRef.current) return;

    const container = transitionGridRef.current;
    container.innerHTML = "";
    blocksRef.current = [];

    const gridWidth = window.innerWidth;
    const gridHeight = window.innerHeight;

    const rows = Math.ceil(gridHeight / BLOCK_SIZE);
    const columns = Math.ceil(gridWidth / BLOCK_SIZE) + 1;

    const offsetX = (gridWidth - columns * BLOCK_SIZE) / 2;
    const offsetY = (gridHeight - rows * BLOCK_SIZE) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const block = document.createElement("div");
        block.className = "transition-block";

        block.style.cssText = `
          position: absolute;
          width: ${BLOCK_SIZE}px;
          height: ${BLOCK_SIZE}px;
          background: #000;
          left: ${col * BLOCK_SIZE + offsetX}px;
          top: ${row * BLOCK_SIZE + offsetY}px;
          transform: scale(0);
          opacity: 0;
        `;

        container.appendChild(block);
        blocksRef.current.push(block);
      }
    }

    gsap.set(blocksRef.current, { scale: 0.1, opacity: 0 });
  };

  useEffect(() => {
    createTransitionGrid();
    window.addEventListener("resize", createTransitionGrid);
    return () => window.removeEventListener("resize", createTransitionGrid);
  }, []);

  return (
    <>
      <TransitionRouter
        auto
        leave={(next) => {
          const tween = gsap.to(blocksRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power2.inOut",
            stagger: { amount: 0.6, from: "random" },
            onComplete: next,
          });

          return () => tween.kill();
        }}
        enter={(next) => {
          gsap.set(blocksRef.current, { opacity: 1 });

          const tween = gsap.to(blocksRef.current, {
            opacity: 0,
            duration: 0.05,
            delay: 0.3,
            ease: "power2.inOut",
            stagger: { amount: 0.5, from: "random" },
            onComplete: next,
          });

          return () => tween.kill();
        }}
      >
        <div
          ref={transitionGridRef}
          className="transition-grid"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />

        {children}
      </TransitionRouter>
    </>
  );
};

export default TransitionProvider;
