import { useEffect, useState } from "react";

interface LoadingDotsProps {
  interval?: number; // 점이 추가되는 속도 (ms)
  maxDots?: number; // 최대 점 개수
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  interval = 500,
  maxDots = 3,
}) => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prev) => (prev + 1) % (maxDots + 1));
    }, interval);

    return () => clearInterval(timer);
  }, [interval, maxDots]);

  return <span>{".".repeat(dots)}</span>;
};
