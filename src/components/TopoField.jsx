import { useEffect, useState } from 'react';

export default function TopoField() {
  const [P5Sketch, setP5Sketch] = useState(null);

  useEffect(() => {
    import('./P5Sketch.jsx').then((mod) => {
      setP5Sketch(() => mod.default);
    });
  }, []);

  return P5Sketch ? <P5Sketch /> : null;
}
