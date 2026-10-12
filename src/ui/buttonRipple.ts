import type { MouseEvent } from "react";

const MOTION_PREFERENCE = "(prefers-reduced-motion: reduce)";

/**
 * One delegated handler for dashboard actions; no listeners or React state per button.
 * Web Animations only changes opacity and transform, so it never affects layout.
 */
export function handleButtonRipple(event: MouseEvent<HTMLDivElement>): void {
  if (window.matchMedia(MOTION_PREFERENCE).matches) return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const button = target.closest<HTMLElement>("button.btn, a.btn");
  if (
    !button ||
    !event.currentTarget.contains(button) ||
    button.matches(":disabled, [aria-disabled='true'], .disabled")
  ) {
    return;
  }

  const rect = button.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  // Keyboard-generated clicks have detail=0 and no meaningful pointer coordinates.
  const x = event.detail === 0 ? rect.width / 2 : event.clientX - rect.left;
  const y = event.detail === 0 ? rect.height / 2 : event.clientY - rect.top;
  const diameter =
    2 *
    Math.max(
      Math.hypot(x, y),
      Math.hypot(rect.width - x, y),
      Math.hypot(x, rect.height - y),
      Math.hypot(rect.width - x, rect.height - y),
    );

  button.querySelectorAll(".dashboard-button-ripple").forEach((existing) => existing.remove());

  const ripple = document.createElement("span");
  ripple.className = "dashboard-button-ripple";
  ripple.setAttribute("aria-hidden", "true");
  ripple.style.width = `${diameter}px`;
  ripple.style.height = `${diameter}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  button.append(ripple);

  const animation = ripple.animate(
    [
      { transform: "translate(-50%, -50%) scale(0)", opacity: 0.2 },
      { transform: "translate(-50%, -50%) scale(1)", opacity: 0 },
    ],
    { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );
  const cleanup = () => ripple.remove();
  animation.addEventListener("finish", cleanup, { once: true });
  animation.addEventListener("cancel", cleanup, { once: true });
}
